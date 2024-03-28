import { AdapterProject } from '../types'

export default {
  name: 'Agnostiq',
  ninja: null,
  subcategories: null,
  chain: null,
  category: 'COMPUTE',
  token: null,
  coinGeckoID: null,
  id: 'anzeat',
  description:
    'Agnostiq develops Covalent, an open-source workflow platform for quantum computing and HPC.',
  discord: null,
  investors: ['ymiffp', '94mx0d', 'ambkkn', 'nj1mri', 'wpxgx7', 'r8l1ds', 'dwir0a', 'zhen2r'],
  linkedin: 'https://www.linkedin.com/company/agnostiq/',
  duneQueries: null,
  foundingYear: null,
  blog: null,
  github: 'https://github.com/agnostiqHQ/covalent',
  telegram: null,
  twitter: 'https://twitter.com/agnostiqHQ',
  url: 'https://agnostiq.ai/',
  verified: false,
  fundraises: [
    {
      roundType: 'Preseed',
      url: 'https://www.hpcwire.com/off-the-wire/agnostiq-secures-2m-seed-round-to-further-develop-saas-based-quantum-solutions/',
    },
    {
      roundType: 'Seed',
      url: 'https://siliconangle.com/2023/04/05/startup-agnostiq-raises-6-1m-integrate-quantum-computing-hpc/',
    },
  ],
} satisfies AdapterProject
