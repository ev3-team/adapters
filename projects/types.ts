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
  | 'BNB'
  | 'DeepBrainChain (Polkadot Substrate)'
  | 'Rowen Blockchain'
  | 'Unknown'
  | 'Ethereum (ERC-20)'
  | 'Bitcoin'
  | 'K2'

export type AdapterProject = {
  id: string
  cmcId: number | null
  category: `${EAdapterProjectCategory}`
  chain: AdapterProjectChain | null
  name: string
  token: string | null
}
