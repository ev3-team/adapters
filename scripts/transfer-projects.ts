import { parse } from 'csv-parse'
import { stringify } from 'csv-stringify'
import * as csv from 'fast-csv'
import fs, { createReadStream, createWriteStream, renameSync, unlinkSync } from 'node:fs'
import path from 'node:path'
import { Transform } from 'stream'
import { AdaptersProjectCsvRow, generateProjectsCsvRow } from '../helpers'
import { Promise as Bluebird } from 'bluebird'

type ExtendedAdaptersProjectCsvRow = AdaptersProjectCsvRow & {
  lineNumber: number
}

/**
 * Edits a specific line in a CSV file
 * @param inputFile The path to the CSV file
 * @param lineNumber The line number (1-based) to edit
 * @param editFunction A function that takes the line object and returns the edited line
 */
async function editCsvLine(
  inputFile: string,
  lineNumber: number,
  editFunction: (line: any) => any
) {
  const parser = parse({
    columns: true,
    skip_empty_lines: true,
  })

  const transformer = new Transform({
    objectMode: true,
    transform(chunk, _encoding, callback) {
      // Keep track of the current line number (excluding header)
      const currentLine = ((this as any).lineCount = ((this as any).lineCount || 0) + 1)

      // Apply edit function only to the specified line
      if (currentLine === lineNumber) {
        chunk = editFunction(chunk)
      }

      callback(null, chunk)
    },
  })

  const stringifier = stringify({
    header: true,
  })

  const tempFile = `${inputFile}.tmp`

  return new Promise((resolve, reject) => {
    createReadStream(inputFile)
      .pipe(parser)
      .pipe(transformer)
      .pipe(stringifier)
      .pipe(createWriteStream(tempFile))
      .on('finish', () => {
        try {
          // Replace the original file with the temporary file
          renameSync(tempFile, inputFile)
          resolve(undefined)
        } catch (error) {
          // Clean up temp file if something goes wrong
          try {
            unlinkSync(tempFile)
          } catch {} // Ignore cleanup errors
          reject(error)
        }
      })
      .on('error', (error) => {
        // Clean up temp file if something goes wrong
        try {
          unlinkSync(tempFile)
        } catch {} // Ignore cleanup errors
        reject(error)
      })
  })
}

/**
 * Loop over the projects in DePIN-Projects.csv and store them in a map
 * @return {Promise<Map<string, ExtendedAdaptersProjectCsvRow>>}
 */
function getExitingProjects(): Promise<Map<string, ExtendedAdaptersProjectCsvRow>> {
  const existingProjects = new Map<string, ExtendedAdaptersProjectCsvRow>()
  let lineNumber = 1
  return new Promise((resolve) => {
    createReadStream(path.resolve(__dirname, 'data/DePIN-Projects.csv'))
      .pipe(csv.parse({ headers: true }))
      .on('error', (error) => console.error(error))
      .on('data', async (row: AdaptersProjectCsvRow) => {
        existingProjects.set(row.id, { ...row, lineNumber })
        lineNumber++
      })
      .on('end', () => resolve(existingProjects))
  })
}

/**
 * Loop over the projects at data/tmp/pending_updates.csv and transfer them to the data/DePIN-Projects.csv
 */
async function transferProjects() {
  const existingProjects = await getExitingProjects()
  const newProjects: AdaptersProjectCsvRow[] = []
  const updatedProjects: ExtendedAdaptersProjectCsvRow[] = []

  new Promise(() => {
    createReadStream(path.resolve(__dirname, 'data/tmp/pending_updates.csv'))
      .pipe(csv.parse({ headers: true }))
      .on('error', (error) => console.error(error))
      .on('data', async (row: ExtendedAdaptersProjectCsvRow) => {
        const existingProject = existingProjects.get(row.id) ?? existingProjects.get(row.name)

        if (existingProject) {
          updatedProjects.push({ ...existingProject, ...row })
        } else {
          newProjects.push(row)
        }
      })
      .on('end', async () => {
        console.log(`Adding ${newProjects.length} new projects`)
        newProjects.forEach((project) => {
          // Add the project to the DePIN-Projects.csv
          try {
            fs.appendFileSync(
              path.resolve(__dirname, 'data/DePIN-Projects.csv'),
              `\n${generateProjectsCsvRow(project)}`
            )
            console.log(`Added project ${project.name} successfully`)
          } catch (error) {
            console.error('Error adding new project to CSV:', error)
          }
        })

        console.log(`Updating ${updatedProjects.length} projects`)
        await Bluebird.map(
          updatedProjects,
          async (project) => {
            // Update the project in the DePIN-Projects.csv
            try {
              await editCsvLine(
                path.resolve(__dirname, 'data/DePIN-Projects.csv'),
                project.lineNumber,
                (line: AdaptersProjectCsvRow) => {
                  line.name = project.name
                  line.url = project.url
                  line.category = project.category
                  line.chain = project.chain
                  line.token = project.token
                  line.coinGeckoID = project.coinGeckoID
                  line.description = project.description
                  line.subcategories = project.subcategories
                  line.ninja = project.ninja
                  line.foundingYear = project.foundingYear
                  line.twitter = project.twitter
                  line.discord = project.discord
                  line.telegram = project.telegram
                  line.blog = project.blog
                  line.github = project.github
                  line.linkedin = project.linkedin
                  line.verified = project.verified
                  line.isActive = project.isActive
                  line.isApp = project.isApp
                  return line
                }
              )
              console.log(`Updated project ${project.name} successfully`)
            } catch (error) {
              console.error('Error updating CSV:', error)
            }
          },
          { concurrency: 1 }
        )
      })
      .on('error', (error) => {
        console.log('Error reading CSV file')
        console.error(error)
      })
  })
}

transferProjects()
