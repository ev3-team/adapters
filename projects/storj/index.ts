import { AdapterProject } from '../types'

export default {
  name: 'Storj',
  chain: 'ETHEREUM',
  category: 'COMPUTE',
  token: 'STORJ',
  coingeckoId: 'storj',
  id: 'arwynb',
  description:
    'Storj is a decentralized cloud storage platform using nodes to host user data in an open-source environment.',
  investors: [],
  duneQueries: {
    BURN: '3202771',
    PRICE: '3202773',
  },
  blog: 'https://medium.com/@storjproject',
  github: 'https://github.com/Storj/',
  telegram: 'https://telegram.me/StorjProject',
  twitter: 'https://twitter.com/storj',
  url: 'https://www.storj.io/',
} satisfies AdapterProject
