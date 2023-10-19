import * as csv from 'fast-csv'
import { createReadStream, existsSync } from 'node:fs'
import fs from 'node:fs/promises'
import path from 'node:path'
import { AdapterInvestor } from '../investors/types'

let investors: AdapterInvestor[] = []

const investorToFileName = (investor: AdapterInvestor) =>
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

const investorToVarName = (investor: AdapterInvestor) =>
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
    // reserver words
    .replaceAll('continue', '_continue')
    .replaceAll('public', '_public')

let index = 0

createReadStream(path.resolve(__dirname, 'data/DePIN-Investors.csv'))
  .pipe(csv.parse())
  .on('error', (error) => console.error(error))
  .on('data', async (row: string[]) => {
    index++

    // ignore row with headers
    if (index === 1) return

    const investor: AdapterInvestor = {
      id: row[0],
      name: row[1],
    }

    investors.push(investor)
  })
  .on('end', async () => {
    const storedInvestors: AdapterInvestor[] = []
    await Promise.all(
      investors.map(async (investor) => {
        const investorFileName = investorToFileName(investor)
        if (!existsSync(`./investors/${investorFileName}`)) {
          await fs.mkdir(`./investors/${investorFileName}`)
        }
        await fs.writeFile(
          `./investors/${investorFileName}/index.ts`,
          `import { AdapterInvestor } from '../types'\n\nexport default ${JSON.stringify(
            investor,
            null,
            2
          )} satisfies AdapterInvestor`
        )
        storedInvestors.push(investor)
      })
    )

    await fs.writeFile(
      './investors/index.ts',
      `${storedInvestors.map(
        (p) => `import ${investorToVarName(p)} from './${investorToFileName(p)}'`
      )}`.replaceAll(',', '\n') +
        `\n\nexport const investors = [${storedInvestors.map(
          (p) => `${investorToVarName(p)}`
        )}]\n\nexport { AdapterInvestor } from './types'`
    )
  })
