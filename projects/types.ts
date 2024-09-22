import { FundRaiseRoundType } from '../scripts/types'

export type AdapterProjectCategory =
  | 'AI'
  | 'BLOCKCHAIN_INFRA'
  | 'COMPUTE'
  | 'ENERGY'
  | 'NOT_DEPIN'
  | 'SENSORS'
  | 'SERVICES'
  | 'RWA'
  | 'WIRELESS'
  | 'PENDING'
  | 'HUMAN_CAPITAL'
  | 'MOBILITY'
  | 'ROBOTICS'
  | 'SCIENCE'
  | 'INTELLECTUAL_PROPERTY'

export type AdapterProjectChain =
  | 'ALGORAND'
  | 'APTOS'
  | 'ARBITRUM'
  | 'AVALANCHE'
  | 'BASE'
  | 'BINANCE'
  | 'BITCOIN'
  | 'BITTENSOR'
  | 'CARDANO'
  | 'COSMOS'
  | 'CRONOS'
  | 'ETHEREUM'
  | 'FILECOIN'
  | 'GNOSIS'
  | 'IOTEX'
  | 'KASPA'
  | 'MULTIVERSX'
  | 'NATIVE'
  | 'OPTIMISM'
  | 'PEAQ'
  | 'POLKADOT'
  | 'POLYGON'
  | 'SOLANA'
  | 'TON'
  | 'URBIT'
  | 'VECHAIN'
  | 'XDC'
  | 'ZKSYNC'

export type AdapterProjectDuneQueryIdentifiers = {
  BURN?: string
  LOCKED_BALANCE?: string
  MINT?: string
  PRICE?: string
  REVENUE?: string
  NET_REVENUE?: string
  SUPPLY?: string
  TIME_SERIES?: string
  KEY_METRIC?: string
  NODE_NUMBER?: string
}

export type AdapterProjectFundRaise = {
  url: string
  roundType: FundRaiseRoundType
}

export type AdapterProject = {
  id: string
  blog: string | null
  category: AdapterProjectCategory
  chain: AdapterProjectChain | null
  coinGeckoID: string | null
  description: string | null
  discord: string | null
  duneQueries: AdapterProjectDuneQueryIdentifiers | null
  foundingYear: string | null
  github: string | null
  investors: string[]
  linkedin: string | null
  name: string
  ninja: string | null
  subcategories: string | null
  telegram: string | null
  token: string | null
  twitter: string | null
  url: string | null
  verified: boolean
  fundraises: AdapterProjectFundRaise[]
  isApp: boolean
}
