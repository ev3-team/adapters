import { AdapterProject } from '../types'

export default {
  name: 'Livepeer',
  chain: 'ETHEREUM',
  category: 'COMPUTE',
  token: 'LPT',
  coingeckoId: 'livepeer',
  id: '0dpzm4',
  description: 'Livepeer is a decentralized network for video encoders and streamers.',
  investors: [],
  duneQueries: {
    MINT: '2944847',
    REVENUE: '2944851',
    SUPPLY: '2944838',
  },
  blog: 'https://medium.com/livepeer-blog',
  github: null,
  telegram: null,
  twitter: 'https://twitter.com/livepeerorg',
} satisfies AdapterProject
