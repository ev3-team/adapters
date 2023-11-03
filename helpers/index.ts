import { AdapterInvestor, investors } from '../investors'
import { AdapterProject, projects } from '../projects'
import { createNewId } from './utils'

export const generateInvestorId = () => createNewId()(true, investors)
export const generateProjectId = () => createNewId()(true, projects)

export const projectToFileName = (project: AdapterProject) =>
  project.name.trim().toLowerCase().replaceAll("'", '').replaceAll(' ', '-').replaceAll('.', '-')

export const projectToVarName = (project: AdapterProject) =>
  project.name
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
    .concat(`${project.category[0]}${project.category.slice(1, project.category.length)}`)

export const investorToFileName = (investor: AdapterInvestor) =>
  investor.name
    .trim()
    .toLowerCase()
    .replaceAll(' ', '-')
    .replaceAll('.', '-')
    .replaceAll('+', '-plus-')
    .replaceAll("'", '')
    .replaceAll('&', '-&-')
    .replaceAll('\\', '-')
    .replaceAll('!', '-')

export const investorToVarName = (investor: AdapterInvestor) =>
  investor.name
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
