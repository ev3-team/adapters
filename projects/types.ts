export type AdapterProjectCategory =
  | 'AI'
  | 'COMPUTE'
  | 'ENERGY'
  | 'LABOR'
  | 'NOT_DEPIN'
  | 'OTHER'
  | 'SENSORS'
  | 'WIRELESS'

export type AdapterProjectChain =
  | 'ETHEREUM'
  | 'ALGORAND'
  | 'COSMOS'
  | 'SOLANA'
  | 'POLKADOT'
  | 'XINFIN'
  | 'IOTEX'
  | 'NATIVE'
  | 'POLYGON'
  | 'BINANCE'
  | 'KADENA'
  | 'ARBITRUM'
  | 'CARDANO'
  | 'BITCOIN'
  | 'GNOSIS'
  | 'PEAQ'
  | 'METIS'
  | 'BNB_CHAIN'
  | 'FILECOIN'
  | 'CRONOS'
  | 'BNB'
  | 'XDC'
  | 'APTOS'
  | 'VECHAIN'

export type AdapterProjectDuneQueryIdentifiers = {
  BURN?: string
  LOCKED_BALANCE?: string
  MINT?: string
  PRICE?: string
  REVENUE?: string
  SUPPLY?: string
  TIME_SERIES?: string
}

export type AdapterProject = {
  id: string
  category: AdapterProjectCategory
  chain: AdapterProjectChain | null
  cmcId: number | null
  coingeckoId: string | null
  description: string | null
  investors: string[]
  name: string
  token: string | null
  duneQueries: AdapterProjectDuneQueryIdentifiers | null
}
