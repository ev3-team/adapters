import assert from 'node:assert'
import { projects } from '../projects'
import { investors } from '../investors'
import { readdirSync, readFileSync } from 'node:fs'

const investorsIds = investors.map(({ id }) => id)

/** Investors validations */
{
  // Validate all investors have a unique id
  assert.equal(
    investors.length,
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
    investors.length,
    dirs.length,
    'Expected the number of investors exported to be the same as the number of directories under the investors directory.'
  )
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
    projects.length,
    dirs.length,
    'Expected the number of projects exported to be the same as the number of directories under the projects directory.'
  )

  // Validate all projects have a unique id
  assert.equal(
    projects.length,
    Array.from(new Set(projects.map((p) => p.id))).length,
    'Something went wrong make sure all projects have a unique id. You can generate a new unique id by running "pnpm generate:project-id"'
  )

  // Validate all projects investors are unique (the same investor should not appear twice for a project).
  projects.map((project) =>
    assert.equal(
      project.investors.length,
      Array.from(new Set(project.investors)).length,
      `Something went wrong make sure all investors are unique for each project. Check the project ${
        project.name
      } with investors: ${project.investors.join(', ')}`
    )
  )

  // Validate all projects investors exist
  projects.map((project) =>
    assert(
      project.investors.every((investorId) => investorsIds.includes(investorId)),
      `Something went wrong make sure all investors linked to projects exist. Check the project ${
        project.name
      } with investors: ${project.investors.join(', ')}`
    )
  )
}
