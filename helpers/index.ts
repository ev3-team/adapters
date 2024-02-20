import { AdapterInvestor, investors } from '../investors'
import { AdapterProject, projects } from '../projects'
import { projectsInvestorsCsv } from './constants'
import { createNewId } from './utils'

export const generateInvestorId = () => createNewId()(true, Object.values(investors))
export const generateProjectId = () => createNewId()(true, Object.values(projects))

export const projectToFileName = (projectName: AdapterProject['name']) =>
  projectName
    .trim()
    .toLowerCase()
    .replaceAll("'", '')
    .replaceAll(' ', '-')
    .replaceAll('.', '-')
    .replaceAll(',', '-')

export const projectToVarName = (projectName: AdapterProject['name']) =>
  projectName
    .trim()
    .toLowerCase()
    // unexpected characters
    .replaceAll('(', '')
    .replaceAll(')', '')
    .replaceAll('.', '')
    .replaceAll("'", '')
    .replaceAll('!', '')
    .replaceAll('^', '')
    .replaceAll('&', 'And')
    .replaceAll(' ', '-')
    .replace(/-([a-z,0-9,A-Z])/g, (g) => g[1].toUpperCase())
    // if the project name start with a number then add an underscore as prefix
    .replace(/^[0-9]/, (g) => `_${g}`)

export const investorToFileName = (investorName: AdapterInvestor['name']) =>
  investorName
    .trim()
    .toLowerCase()
    .replaceAll(' ', '-')
    .replaceAll('.', '-')
    .replaceAll('+', '-plus-')
    .replaceAll("'", '')
    .replaceAll('&', '-&-')
    .replaceAll('\\', '-')
    .replaceAll('!', '-')
    .replaceAll(',', '-')
    .replace(/^[0-9]/, (g) => `_${g}`)
    // reserved words
    .replaceAll('index', '_index')

export const investorToVarName = (investorName: AdapterInvestor['name']) =>
  investorName
    .trim()
    .toLowerCase()
    .replace(/\.([a-z,0-9,A-Z])/g, (g) => g[1].toUpperCase())
    .replace(/\[([a-z,0-9,A-Z])/g, (g) => g[1].toUpperCase())
    .replace(/\]([a-z,0-9,A-Z])/g, (g) => g[1].toUpperCase())
    .replace(/-([a-z,0-9,A-Z])/g, (g) => g[1].toUpperCase())
    .replace(/\s([a-z,0-9,A-Z])/g, (g) => g[1].toUpperCase())
    // if the investor name start with a number then add an underscore as prefix
    .replace(/^[0-9]/, (g) => `_${g}`)
    // unexpected characters
    .replaceAll('(', '')
    .replaceAll(')', '')
    .replaceAll('[', '')
    .replaceAll(']', '')
    .replaceAll("'", '')
    .replaceAll('&', 'And')
    .replaceAll('\\', '')
    .replaceAll('!', '')
    .replaceAll('+', 'Plus')
    .replaceAll(' ', '')
    .replaceAll(',', '')
    .replaceAll('.', '')
    .replaceAll('#', '')
    // reserved words
    .replaceAll('continue', '_continue')
    .replaceAll('public', '_public')
    .replaceAll('true', '_true')
    .replaceAll('index', '_index')
    .replaceAll('super', '_super')

export type AdaptersProjectCsvRow = {
  name: string
  id: string
  url: string
  category: string
  chain: string
  token: string
  coinGeckoID: string
  description: string
  subcategories: string
  ninja: string
  foundingYear: string
  twitter: string
  discord: string
  telegram: string
  blog: string
  github: string
  linkedin: string
  verified: string
}

/** Generates a row for the projects csv. */
export const generateProjectsCsvRow = (p: AdaptersProjectCsvRow) =>
  `${p.name},${p.id},${p.url},${p.category},${p.chain},${p.token},${p.coinGeckoID},${
    p.description.includes(',') ? `"${p.description}"` : p.description // If description includes commas then add quotation marks to avoid messing the csv file.
  },${p.subcategories},${p.ninja},${p.foundingYear},${p.twitter},${p.discord},${p.telegram},${
    p.blog
  },${p.github},${p.linkedin},${p.verified}`

export type AdapterProjectDuneCsvRow = {
  name: string
  id: string
  BURN?: string
  LOCKED_BALANCE?: string
  MINT?: string
  PRICE?: string
  REVENUE?: string
  NET_REVENUE?: string
  SUPPLY?: string
  TIME_SERIES?: string
  KEY_METRIC?: string
  NODE_NUMBER?: string
}
/** Generates a row for the projects dune csv. */
export const generateProjectsDuneCsvRow = (p: AdapterProjectDuneCsvRow) =>
  `${p.name},${p.id},${p.BURN},${p.LOCKED_BALANCE},${p.MINT},${p.PRICE},${p.REVENUE},${p.NET_REVENUE},${p.SUPPLY},${p.TIME_SERIES},${p.KEY_METRIC},${p.NODE_NUMBER}`

/** Generates a row for the investors csv. */
export const generateInvestorCsvRow = (i: Pick<AdapterInvestor, 'id' | 'name'>) =>
  `${i.name},${i.id}`

type GenerateInvestorProjectsCsvRowArgs = {
  investor: Pick<AdapterInvestor, 'id' | 'name'>

  /** The list of ids the given projects has invested in. */
  projectsInvestedIds: string[]
}

/** Generates a row for the investors/projects csv. */
export const generateInvestorProjectsCsvRow = ({
  investor,
  projectsInvestedIds,
}: GenerateInvestorProjectsCsvRowArgs) => {
  /**
   * Initially the variable `projectsInvestorsCsvProjectIdsColumns` was provided as argument, it was fetched from the server in real time to make sure the csv row was generated correctly
   * but after the `DePIN-Projects-Investors.csv` became too big the github API stopped working.
   * ```sh curl -L \
   * -H "Accept: application/vnd.github+json" \
   * -H "Authorization: Bearer TOKEN" \
   * -H "X-GitHub-Api-Version: 2022-11-28" \
   * https://api.github.com/repos/ev3-team/adapters/contents/scripts/data/DePIN-Projects-Investors.csv
   * ```
   * the content in the response comes empty. I'm guessing it's due to the file size.
   * That's why we are generating the var `projectsInvestorsCsvProjectIdsColumns` before hand, at the risk of getting out of sync with the csv at stg.
   */
  const projectIdColumns = projectsInvestorsCsv[1]?.split(',')?.slice(2)

  return `${investor.name},${investor.id},${projectIdColumns
    .map((projectIdColumn) => (projectsInvestedIds.includes(projectIdColumn) ? '1' : ''))
    .join(',')}`
}

export { projectsInvestorsCsv } from './constants'
