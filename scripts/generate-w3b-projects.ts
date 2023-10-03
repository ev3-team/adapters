import assert from 'node:assert'
import { AdapterProject, EAdapterProjectCategory } from '../projects/types'
import { createNewId } from './utils'
import { mkdir, writeFile } from 'node:fs/promises'
import * as dotenv from 'dotenv'
dotenv.config()

import { AdapterProjectChain } from '../projects/types'

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

const categoryMapping = (project: W3BStreamProject): `${EAdapterProjectCategory}` => {
  if (project.categories.includes('Wireless')) {
    return 'Wireless'
  } else if (project.categories.includes('Sensor') && !project.sub_categories?.includes('Energy')) {
    return 'Sensors'
  } else if (project.categories.includes('Sensor') && project.sub_categories?.includes('Energy')) {
    return 'Energy'
  } else if (project.categories.includes('Server') && !project.sub_categories?.includes('AI')) {
    return 'Compute'
  } else if (project.sub_categories?.includes('AI')) {
    return 'AI'
  } else {
    return 'Other'
  }
}

export const parseProject = (project: W3BStreamProject): Omit<AdapterProject, 'id' | 'cmcId'> => ({
  name: project.project_name,
  chain: project.layer_1?.[0] ?? null,
  category: categoryMapping(project),
  token: project.token,
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

async function cmcFetchId(name: string) {
  const headers = new Headers()
  headers.append('X-CMC_PRO_API_KEY', `${process.env.CMC_API_KEY}`)

  /**
   * Report: Slug generated for "Daylight Energy (formerly React Network)" does not match
   * any slug in the cmc API, therefore that one should be added manually.
   */
  let slug = name.trim().toLowerCase().replaceAll(' ', '-').replaceAll('.', '-')
  // override render otoy slug to match cmc api slug.
  if (slug === 'render-(otoy)') {
    slug = 'otoy'
  }

  return fetch(`${process.env.CMC_API_URL}/v2/cryptocurrency/quotes/latest?slug=${slug}`, {
    headers,
  })
    .then((response) => response.json())
    .then((result) => ({ name, id: (result?.data[slug]?.id as number) ?? null }))
    .catch((error) => {
      console.log(
        `error fetching project cmc id for project ${name} with computed slug ${slug}`,
        error
      )
      return { name, id: null }
    })
}

export async function fetchW3bProjectsCmcIds(projects: W3BStreamProject[]) {
  return (await Promise.all(projects.map((p) => p.project_name).map(cmcFetchId))).reduce(
    (acc, kv) => {
      acc[kv.name] = kv.id
      return acc
    },
    {} as Record<string, number | null>
  )
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
    const cmcIds = await fetchW3bProjectsCmcIds(projects)
    const parsedProjects: AdapterProject[] = []
    for (const project of projects) {
      parsedProjects.push({
        ...parseProject(project),
        id: await newProjectId(true, parsedProjects),
        cmcId: cmcIds[project.project_name],
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
        `\n\nexport const projects = [${storedProjects.map((p) => `${projectToVarName(p)}`)}]`
    )
  } catch (error) {
    console.error(error)
  }
}

// pnpm generate:w3b
run()
