export type AdapterProjectCategory =
  | 'AI'
  | 'BLOCKCHAIN_INFRA'
  | 'COMPUTE'
  | 'ENERGY'
  | 'NOT_DEPIN'
  | 'SENSORS'
  | 'SERVICES'
  | 'WIRELESS'

export type AdapterProjectChain =
  | 'ALGORAND'
  | 'APTOS'
  | 'ARBITRUM'
  | 'AVALANCHE'
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
}
