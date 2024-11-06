import { AdapterProject } from '../types'

export default {
  name: 'Storj',
  ninja: null,
  subcategories: 'Storage',
  chain: 'ETHEREUM',
  category: 'COMPUTE',
  token: 'STORJ',
  coinGeckoID: 'storj',
  id: 'arwynb',
  description:
    'Storj is a decentralized cloud storage platform using nodes to host user data in an open-source environment.',
  discord: '793919814623166525',
  investors: ['5a1i7n', 'dc26g1', 'yont93', 'fdbarc', 'tqc1qx', 'a1uyxq'],
  linkedin: 'https://www.linkedin.com/company/storj/about/',
  duneQueries: {
    BURN: '3202771',
    PRICE: '3202773',
  },
  foundingYear: null,
  blog: 'https://medium.com/@storjproject',
  github: 'https://github.com/Storj/',
  telegram: null,
  twitter: 'https://twitter.com/storj',
  url: 'https://www.storj.io/',
  verified: false,
  fundraises: [
    {
      roundType: 'Preseed',
      url: 'https://www.coindesk.com/markets/2014/08/22/cloud-storage-startup-storj-raises-910-btc-in-crowdsale/',
    },
    {
      roundType: 'Seed',
      url: 'https://www.coindesk.com/markets/2017/02/23/blockchain-startup-storj-targets-enterprise-cloud-with-3-million-raise/',
    },
  ],
  isApp: true,
} satisfies AdapterProject
