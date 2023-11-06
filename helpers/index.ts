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
