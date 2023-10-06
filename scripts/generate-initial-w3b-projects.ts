import assert from 'node:assert'
import { mkdir, writeFile } from 'node:fs/promises'
import { AdapterProject, AdapterProjectCategory, AdapterProjectToken } from '../projects/types'
import { createNewId } from './utils'

import { AdapterProjectChain } from '../projects/types'
import { projectsCmcIds } from './cmc-ids'

type Category = 'Server' | 'Sensor' | 'Wireless' | 'Other' | 'Compute' | 'Data' | 'Storage'
type SubCategory =
  | 'CDN'
  | 'Storage'
  | 'Data Warehouse'
  | 'Mobility'
  | 'VPN'
  | 'Geo Location'
  | 'Sensor'
  | 'Supply AdapterProjectChain'
  | 'Compute'
  | 'Smart Home'
  | 'Smart City'
  | 'Environmental'
  | 'Advertising'
  | 'LoRaWAN'
  | 'Energy'
  | 'RPC'
  | 'AI'
  | 'General'
  | 'Healthcare'
  | '5G'
  | 'WiFi'
  | 'Ridesharing'
  | 'Indexer'
  | 'Search'
  | 'Neuro'
  | 'Bluetooth'
  | 'Food Delivery'
  | 'Supply Chain'

type W3BStreamProject = {
  project_name: string
  trusted_metric: boolean
  token: string | null
  layer_1: AdapterProjectChain[] | null
  categories: Category[]
  sub_categories?: SubCategory[] | null
  market_cap?: number | string | null
  token_price?: number | null
  total_devices: number
  network_status: string | null
  avg_device_cost: string | null
  days_to_breakeven: number
  estimated_daily_earnings: number | string | null
  name?: string
  poolid: string | null
  chainid: string | null
  coingecko_id: string | null
  fully_diluted_valuation?: number
}

const categoryMapping = (project: W3BStreamProject): AdapterProjectCategory => {
  if (project.categories.includes('Wireless')) {
    return 'WIRELESS'
  } else if (project.categories.includes('Sensor') && !project.sub_categories?.includes('Energy')) {
    return 'SENSORS'
  } else if (project.categories.includes('Sensor') && project.sub_categories?.includes('Energy')) {
    return 'ENERGY'
  } else if (project.categories.includes('Server') && !project.sub_categories?.includes('AI')) {
    return 'COMPUTE'
  } else if (project.sub_categories?.includes('AI')) {
    return 'AI'
  } else {
    return 'OTHER'
  }
}

export const parseProject = (project: W3BStreamProject): Omit<AdapterProject, 'id' | 'cmcId'> => ({
  name: project.project_name,
  chain: project.layer_1?.[0] ?? null,
  category: categoryMapping(project),
  token: project.token as AdapterProjectToken,
  // There's a total of 77 projects registered with a coingecko id currently
  coingeckoId: project.coingecko_id,
  description: null,
})

export const W3B_STREAM_API = 'https://metrics-api.w3bstream.com'

export async function fetchProjects(): Promise<W3BStreamProject[] | null> {
  const apiUrl = `${W3B_STREAM_API}/project`
  try {
    const res = await fetch(apiUrl)
    const response = await res.json()
    return response
  } catch (e) {
    console.error('Connection failed to', apiUrl)
    console.error(e)
    return null
  }
}

const projectToFileName = (project: AdapterProject) =>
  project.name.trim().toLowerCase().replaceAll(' ', '-').replaceAll('.', '-')

const projectToVarName = (project: AdapterProject) =>
  project.name
    .trim()
    .toLowerCase()
    .replaceAll('(', '')
    .replaceAll(')', '')
    .replaceAll('.', '')
    .replaceAll(' ', '-')
    .replace(/-([a-z,1-9,A-Z])/g, (g) => g[1].toUpperCase())
    // if the project name start with a number then add an underscore as prefix
    .replace(/^[1-9]/, (g) => `_${g}`)
    .concat(project.category)

const newProjectId = createNewId()

async function run() {
  try {
    const projects = await fetchProjects()
    if (!projects) throw new Error('No projects found')
    const parsedProjects: AdapterProject[] = []
    for (const project of projects) {
      parsedProjects.push({
        ...parseProject(project),
        id: await newProjectId(true, parsedProjects),
        // There's a total of 83 projects registered with a cmc id currently
        cmcId: projectsCmcIds[project.project_name as keyof typeof projectsCmcIds]?.id ?? null,
      })
    }

    // Validate ids must be unique between projects
    assert.equal(
      parsedProjects.length,
      Array.from(new Set(parsedProjects.map((p) => p.id))).length,
      'Something went wrong make sure all projects have a unique id.'
    )

    const storedProjects: AdapterProject[] = []

    await Promise.all(
      parsedProjects.map(async (project) => {
        try {
          const projectFileName = projectToFileName(project)
          await mkdir(`./projects/${projectFileName}`)
          await writeFile(
            `./projects/${projectFileName}/index.ts`,
            `import { AdapterProject } from '../types'\n\nexport default ${JSON.stringify(
              project,
              null,
              2
            )} satisfies AdapterProject`
          )

          // if the project was successfully stored then we store it in the var names that will be exported by the package.
          storedProjects.push(project)
        } catch (error) {
          console.log(
            `There was a problem generating the project ${project.name} with data ${JSON.stringify(
              project
            )}`,
            error
          )
        }
      })
    )

    await writeFile(
      './projects/index.ts',
      `${storedProjects.map(
        (p) => `import ${projectToVarName(p)} from './${projectToFileName(p)}'`
      )}`.replaceAll(',', '\n') +
        `\n\nexport const projects = [${storedProjects.map(
          (p) => `${projectToVarName(p)}`
        )}]\n\nexport { AdapterProject } from './types'`
    )
  } catch (error) {
    console.error(error)
  }
}

// pnpm generate:w3b
run()
