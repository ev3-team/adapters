import * as csv from 'fast-csv'
import assert from 'node:assert'
import { createReadStream, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { investors } from '../investors'
import { projects } from '../projects'

const projectsList = Object.values(projects)
const investorsList = Object.values(investors)

const investorsIds = investorsList.map(({ id }) => id)

/** Investors validations */
{
  // Validate all investors have a unique id
  assert.equal(
    investorsList.length,
    Array.from(new Set(investorsIds)).length,
    'Something went wrong make sure all projects have a unique id. You can generate a new unique id by running "pnpm generate:investor-id"'
  )

  const dirs = readdirSync(`./investors`).filter((dir) => dir !== 'index.ts' && dir !== 'types.ts')

  let count = 0
  const data = readFileSync('./investors/index.ts', 'utf-8')
  const importInvestors = data
    .split('export const investors')[0]
    .split('\n')
    .filter(Boolean)
    .map((line) => line.split(`from './`)[1].replaceAll("'", ''))

  dirs.forEach((d) => {
    count++
    if (!importInvestors.includes(d)) {
      console.warn(`[WARN] Expected investor ${d} to be exported by list at investors/index.ts.`)
    }
  })

  assert.equal(
    investorsList.length,
    dirs.length,
    'Expected the number of investors exported to be the same as the number of directories under the investors directory.'
  )

  // Validate csv and folder are in sync
  const investorsNames = investorsList.map((investor) => investor.name)
  createReadStream(path.resolve(__dirname, 'data/DePIN-Investors.csv'))
    .pipe(csv.parse({ headers: true }))
    .on('error', (error) => console.error(error))
    .on('data', async (row) => {
      assert(
        investorsNames.includes(row.name),
        `Investor with name: "${row.name}" found in DePIN-Investors.csv was not found in investors list.  Make sure all investors in the investors csv exist in the investors folder. Run \`pnpm update:investors\` to update investors list.`
      )
    })
}

/** Projects validations */
{
  // Validate all projects are exported
  const dirs = readdirSync(`./projects`).filter((dir) => dir !== 'index.ts' && dir !== 'types.ts')

  let count = 0
  const data = readFileSync('./projects/index.ts', 'utf-8')
  const importProjects = data
    .split('export const projects')[0]
    .split('\n')
    .filter(Boolean)
    .map((line) => line.split(`from './`)[1].replaceAll("'", ''))

  dirs.forEach((d) => {
    count++
    if (!importProjects.includes(d)) {
      console.warn(`[WARN] Expected project ${d} to be exported by list at projects/index.ts.`)
    }
  })

  assert.equal(
    projectsList.length,
    dirs.length,
    'Expected the number of projects exported to be the same as the number of directories under the projects directory.'
  )

  // Validate all projects have a unique id
  assert.equal(
    projectsList.length,
    Array.from(new Set(projectsList.map((p) => p.id))).length,
    'Something went wrong make sure all projects have a unique id. You can generate a new unique id by running "pnpm generate:project-id"'
  )

  // Validate all projects investors are unique (the same investor should not appear twice for a project).
  projectsList.map((project) =>
    assert.equal(
      project.investors.length,
      Array.from(new Set(project.investors)).length,
      `Something went wrong make sure all investors are unique for each project. Check the project ${
        project.name
      } with investors: ${project.investors.join(', ')}`
    )
  )

  // Validate all projects investors exist
  projectsList.map((project) =>
    assert(
      project.investors.every((investorId) => investorsIds.includes(investorId)),
      `Something went wrong make sure all investors linked to projects exist. Check the project ${
        project.name
      } with investors: ${project.investors.join(', ')}`
    )
  )

  // Validate csv and folder are in sync
  const projectsNames = projectsList.map((project) => project.name)
  createReadStream(path.resolve(__dirname, 'data/DePIN-Projects.csv'))
    .pipe(csv.parse({ headers: true }))
    .on('error', (error) => console.error(error))
    .on('data', async (row) =>
      assert(
        projectsNames.includes(row.name),
        `Project with name: "${row.name}" found in DePIN-Projects.csv was not found in projects list.  Make sure all projects in the projects csv exist in the projects folder. Run \`pnpm update:projects\` to update projects list.`
      )
    )
}
