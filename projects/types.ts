export enum EProjectCategory {
  WIRELESS = 'Wireless',
  SENSORS = 'Sensors',
  ENERGY = 'Energy',
  COMPUTE = 'Compute',
  AI = 'AI',
  OTHER = 'Other',
}

export type Chain =
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
  | 'BNB'

export type Project = {
  category: `${EProjectCategory}`
  chain: Chain | null
  marketCap: number
  name: string
  token: string | null
}
