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

export type AdapterProjectChain =
  | 'ALGORAND'
  | 'APTOS'
  | 'ARBITRUM'
  | 'AVALANCHE'
  | 'BINANCE'
  | 'BITCOIN'
  | 'BITTENSOR'
  | 'BASE'
  | 'CARDANO'
  | 'COSMOS'
  | 'CRONOS'
  | 'ETHEREUM'
  | 'FILECOIN'
  | 'GNOSIS'
  | 'IOTEX'
  | 'MULTIVERSX'
  | 'NATIVE'
  | 'PEAQ'
  | 'POLKADOT'
  | 'POLYGON'
  | 'SOLANA'
  | 'URBIT'
  | 'VECHAIN'
  | 'XDC'
  | 'ZKSYNC'
  | 'TON'

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
}
