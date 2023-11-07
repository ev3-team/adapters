import { AdapterProject } from '../types'

export default {
  name: 'Helium',
  chain: 'SOLANA',
  category: 'WIRELESS',
  token: 'HNT',
  coingeckoId: 'helium',
  id: '5bm99m',
  description: 'Helium is a decentralized network for IoT.',
  investors: [],
  duneQueries: {
    MINT: '2573591',
    REVENUE: '2944853',
    SUPPLY: '3043582',
    TIME_SERIES: '2944860',
  },
  cmcId: 5665,
} satisfies AdapterProject
