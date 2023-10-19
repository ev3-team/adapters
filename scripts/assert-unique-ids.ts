import assert from 'node:assert'
import { projects } from '../projects'
import { investors } from '../investors'

// Validate all projects have a unique id
assert.equal(
  projects.length,
  Array.from(new Set(projects.map((p) => p.id))).length,
  'Something went wrong make sure all projects have a unique id. You can generate a new unique id by running "pnpm generate:id"'
)

const investorsIds = investors.map(({ id }) => id)

// Validate all investors have a unique id
assert.equal(
  investors.length,
  Array.from(new Set(investorsIds)).length,
  'Something went wrong make sure all projects have a unique id. You can generate a new unique id by running "pnpm generate:investor-id"'
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
