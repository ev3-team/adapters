import { AdapterInvestor, investors } from '../investors'
import { AdapterProject, projects } from '../projects'
import { createNewId } from './utils'

export const generateInvestorId = () => createNewId()(true, Object.values(investors))
export const generateProjectId = () => createNewId()(true, Object.values(projects))

export const projectToFileName = (projectName: AdapterProject['name']) =>
  projectName.trim().toLowerCase().replaceAll("'", '').replaceAll(' ', '-').replaceAll('.', '-')

export const projectToVarName = (projectName: AdapterProject['name']) =>
  projectName
    .trim()
    .toLowerCase()
    // unexpected characters
    .replaceAll('(', '')
    .replaceAll(')', '')
    .replaceAll('.', '')
    .replaceAll("'", '')
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

export const investorToVarName = (investorName: AdapterInvestor['name']) =>
  investorName
    .trim()
    .toLowerCase()
    .replace(/-([a-z,1-9,A-Z])/g, (g) => g[1].toUpperCase())
    // if the investor name start with a number then add an underscore as prefix
    .replace(/^[1-9]/, (g) => `_${g}`)
    // unexpected characters
    .replaceAll('(', '')
    .replaceAll(')', '')
    .replaceAll('.', '')
    .replaceAll(' ', '')
    .replaceAll("'", '')
    .replaceAll('&', 'And')
    .replaceAll('\\', '')
    .replaceAll('!', '')
    .replaceAll('+', 'Plus')
    // reserved words
    .replaceAll('continue', '_continue')
    .replaceAll('public', '_public')
    .replaceAll('true', '_true')

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
  twitter: string
  discord: string
  telegram: string
  blog: string
  github: string
  linkedin: string
}

/** Generates a row for the projects csv. */
export const generateProjectsCsvRow = (p: AdaptersProjectCsvRow) =>
  `${p.name},${p.id},${p.url},${p.category},${p.chain},${p.token},${p.coinGeckoID},${p.description},${p.subcategories},${p.twitter},${p.discord},${p.telegram},${p.blog},${p.github},${p.linkedin}`

export type AdapterProjectDuneCsvRow = {
  name: string
  id: string
  BURN?: string
  LOCKED_BALANCE?: string
  MINT?: string
  PRICE?: string
  REVENUE?: string
  SUPPLY?: string
  TIME_SERIES?: string
}
/** Generates a row for the projects dune csv. */
export const generateProjectsDuneCsvRow = (p: AdapterProjectDuneCsvRow) =>
  `${p.name},${p.id},${p.BURN},${p.LOCKED_BALANCE},${p.MINT},${p.PRICE},${p.REVENUE},${p.SUPPLY},${p.TIME_SERIES}`

/** Generates a row for the investors csv. */
export const generateInvestorCsvRow = (i: Pick<AdapterInvestor, 'id' | 'name'>) =>
  `${i.name},${i.id}`

type GenerateInvestorProjectsCsvRowArgs = {
  investor: Pick<AdapterInvestor, 'id' | 'name'>

  /** The list of ids the given projects has invested in. */
  projectsInvestedIds: string[]

  /** List of existing projects ids at `DePIN-Projects-Investors.csv` (second row) */
  projectIdColumns: string[]
}

/** Generates a row for the investors/projects csv. */
export const generateInvestorProjectsCsvRow = ({
  investor,
  projectsInvestedIds,
  projectIdColumns,
}: GenerateInvestorProjectsCsvRowArgs) =>
  `${investor.name},${investor.id},${projectIdColumns
    .map((projectIdColumn) => (projectsInvestedIds.includes(projectIdColumn) ? '1' : ''))
    .join(',')}`
