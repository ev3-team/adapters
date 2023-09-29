import { writeFile, mkdir } from 'node:fs/promises'
import { Chain, Project, EProjectCategory } from '../projects/types'

type Category = 'Server' | 'Sensor' | 'Wireless' | 'Other'
type SubCategory =
  | 'CDN'
  | 'Storage'
  | 'Data Warehouse'
  | 'Mobility'
  | 'VPN'
  | 'Geo Location'
  | 'Sensor'
  | 'Supply Chain'
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

type W3BStreamProject = {
  project_name: string
  trusted_metric: boolean
  token: string | null
  layer_1: Chain[] | null
  categories: Category[]
  sub_categories?: SubCategory[]
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

const categoryMapping = (project: W3BStreamProject): `${EProjectCategory}` => {
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

export const parseProjects = (projects: W3BStreamProject[]): Project[] =>
  projects.map((project) => ({
    name: project.project_name,
    chain: project.layer_1?.[0] ?? null,
    marketCap: project.fully_diluted_valuation ?? 0,
    category: categoryMapping(project),
    token: project.token,
  }))

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

const projectToFileName = (project: Project) =>
  project.name.trim().toLowerCase().replaceAll(' ', '-').replaceAll('.', '-')

const projectToVarName = (project: Project) =>
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

async function run() {
  try {
    const projects = await fetchProjects()
    if (!projects) throw new Error('No projects found')
    const parsedProjects = parseProjects(projects)

    const storedProjects: Project[] = []

    await Promise.all(
      parsedProjects.map(async (project) => {
        try {
          const projectFileName = projectToFileName(project)
          await mkdir(`./projects/${projectFileName}`)
          await writeFile(
            `./projects/${projectFileName}/index.ts`,
            `import { Project } from '../types'\n\nexport default ${JSON.stringify(
              project,
              null,
              2
            )} satisfies Project`
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
