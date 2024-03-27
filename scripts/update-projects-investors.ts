import * as csv from 'fast-csv'
import { createReadStream } from 'node:fs'
import fs from 'node:fs/promises'
import path from 'node:path'
import { investors } from '../investors'
import { AdapterInvestor } from '../investors/types'
import { AdapterProject, projects } from '../projects'
import { FundRaiseRow } from './types'

const projectsList: AdapterProject[] = Object.values(projects)
const investorsList: AdapterInvestor[] = Object.values(investors)

const fundRaiseProjects: string[] = []
const fundRaiseInvestors: string[] = []
const investorProjectsMap = new Map<string, string[]>()

createReadStream(path.resolve(__dirname, 'data/DePIN-Fundraises.csv'))
  .pipe(csv.parse({ headers: true }))
  .on('error', (error) => console.error(error))
  .on('data', async (row: FundRaiseRow) => {
    fundRaiseProjects.push(row.projectId)
    const rowInvestorsIds = row.investorsIds.split(',')
    fundRaiseInvestors.push(...rowInvestorsIds)
    rowInvestorsIds.forEach((rowInvestorsId) => {
      const investorInvestments = investorProjectsMap.get(rowInvestorsId)
      const updatedInvestments = investorInvestments
        ? [...investorInvestments, row.projectId]
        : [row.projectId]
      investorProjectsMap.set(rowInvestorsId, Array.from(new Set(updatedInvestments)))
    })
  })
  .on('end', async () => {
    const investedProjectsIds = Array.from(new Set(fundRaiseProjects)).filter(Boolean)
    const investedProjects = investedProjectsIds
      .map((investedProjectId) => {
        const project = projectsList.find((p) => p.id === investedProjectId)
        if (!project) {
          console.error(`Project with id ${investedProjectId} was not found.`)
          return null
        }
        return project
      })
      .filter(Boolean) as AdapterProject[]
    investedProjects.sort((a, b) => a.name.localeCompare(b.name))

    const investedInvestorsIds = Array.from(new Set(fundRaiseInvestors)).filter(Boolean)
    const investedInvestors = investedInvestorsIds
      .map((investedInvestorId) => {
        const investor = investorsList.find((p) => p.id === investedInvestorId)
        if (!investor) {
          console.error(`Investor with id ${investedInvestorId} was not found.`)
          return null
        }
        return investor
      })
      .filter(Boolean) as AdapterInvestor[]
    investedInvestors.sort((a, b) => a.name.localeCompare(b.name))

    let headerRow = ',Project Name'
    let subheaderRow = 'Investment Firm,Investor Id/Project Id'
    investedProjects.forEach((investedProject) => {
      headerRow += `,${investedProject.name}`
      subheaderRow += `,${investedProject.id}`
    })

    let csvContents = `${headerRow}\n${subheaderRow}`

    investedInvestors.forEach((investedInvestor) => {
      csvContents += `\n${investedInvestor.name},${investedInvestor.id},`
      const investments = investorProjectsMap.get(investedInvestor.id)
      investedProjects.forEach((investedProject) => {
        if (investments?.includes(investedProject.id)) {
          csvContents += '1'
        }
        csvContents += `,`
      })
    })

    fs.writeFile('scripts/data/DePIN-Projects-Investors-Generated.csv', csvContents, 'utf-8')
  })
