import { AdapterProject } from '../types'

export default {
  name: 'Storj',
  subcategories: 'Storage',
  chain: 'ETHEREUM',
  category: 'COMPUTE',
  token: 'STORJ',
  coingeckoId: 'storj',
  id: 'arwynb',
  description:
    'Storj is a decentralized cloud storage platform using nodes to host user data in an open-source environment.',
  discord: 'https://forum.storj.io/t/unofficial-discord-for-sno-s/10943',
  investors: [],
  linkedin: 'https://www.linkedin.com/company/storj/about/',
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
