import assert from 'node:assert'
import { projects } from '../projects'

assert.equal(
  projects.length,
  Array.from(new Set(projects.map((p) => p.id))).length,
  'Something went wrong make sure all projects have a unique id. You can generate a new unique id by running "pnpm generate:id"'
)
