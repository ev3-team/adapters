import { AdapterProject } from '../types'

export default {
  name: 'Geodnet',
  chain: 'POLYGON',
  category: 'SENSORS',
  token: 'GEOD',
  coingeckoId: 'geodnet',
  id: 'scli9r',
  description: 'Geodnet is a decentralized network of GNSS reference stations.',
  investors: ['buo8ql'],
  duneQueries: {
    BURN: '2944840',
    LOCKED_BALANCE: '2944845',
    MINT: '2944854',
    PRICE: '2944842',
  },
} satisfies AdapterProject
