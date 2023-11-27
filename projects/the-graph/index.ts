import { AdapterProject } from '../types'

export default {
  name: 'The Graph',
  chain: 'ETHEREUM',
  category: 'OTHER',
  token: 'GRT',
  coingeckoId: 'the-graph',
  id: 'x3ay3v',
  description:
    'The Graph: a blockchain indexing protocol, providing efficient GraphQL-based access to blockchain data.',
  investors: [],
  duneQueries: {
    BURN: '3168402',
    LOCKED_BALANCE: '3168407',
    MINT: '3168410',
    PRICE: '3168415',
  },
  blog: 'https://medium.com/graphprotocol',
  github: 'https://github.com/graphprotocol',
  telegram: 'https://t.me/graphprotocol',
  twitter: 'https://twitter.com/graphprotocol',
} satisfies AdapterProject
