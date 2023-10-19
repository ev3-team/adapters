import assert from 'node:assert'
import { projects } from '../projects'
import { investors } from '../investors'

// Validate all projects have a unique id
assert.equal(
  projects.length,
  Array.from(new Set(projects.map((p) => p.id))).length,
  'Something went wrong make sure all projects have a unique id. You can generate a new unique id by running "pnpm generate:id"'
)

// Validate all investors have a unique id
assert.equal(
  investors.length,
  Array.from(new Set(investors.map((p) => p.id))).length,
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
