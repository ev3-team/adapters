export enum EAdapterProjectCategory {
  WIRELESS = 'Wireless',
  SENSORS = 'Sensors',
  ENERGY = 'Energy',
  COMPUTE = 'Compute',
  AI = 'AI',
  OTHER = 'Other',
}

export type AdapterProjectChain =
  | 'Ethereum'
  | 'Algorand'
  | 'Cosmos'
  | 'Solana'
  | 'Polkadot'
  | 'XinFin'
  | 'IoTeX'
  | 'Native'
  | 'Polygon'
  | 'Binance'
  | 'Kadena'
  | 'Arbitrum'
  | 'Cardano'
  | 'Bitcoin'

export type AdapterProject = {
  id: string
  cmcId: number | null
  coingeckoId: string | null
  category: `${EAdapterProjectCategory}`
  chain: AdapterProjectChain | null
  name: string
  token: string | null
  description: string | null
}
