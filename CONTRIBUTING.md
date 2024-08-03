# Contributing to Ev3 Adapters

## Code of Conduct

EV3 has adopted the [Contributor Covenant](https://www.contributor-covenant.org/) as its Code of
Conduct, and we expect project participants to adhere to it.

Please read [the full text](./CODE_OF_CONDUCT.md) so that you can understand what actions will and
will not be tolerated.

## Working on your first Pull Request?

There are a lot of great resources on creating a good pull request. We've included a few below, but
don't be shy we appreciate all contributions and are happy to help those who are willing to help us!

- [How to Contribute to a Project on GitHub](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github)

## Adding a new project?

Awesome! It's pretty straight-forward.
We recommend copying an existing project to get started. You'll see
that they all follow a similar pattern. You'll need to fill out:

1. Project Name:
2. Chain: Choose between:
 - Use 'NATIVE' for native chains or 'n/a' for projects with no token.
```
[
  'ALGORAND',  'APTOS',      'ARBITRUM',
  'AVALANCHE', 'BASE',       'BINANCE',
  'BITTENSOR', 'CARDANO',    'COSMOS',
  'ETHEREUM',  'FILECOIN',   'GNOSIS',
  'IOTEX',     'KADENA',     'MULTIVERSX', 
  'NATIVE',    'n/a',        'PEAQ',      
  'POLKADOT',   'POLYGON',   'SOLANA',    
  'TON',        'URBIT',     'VECHAIN',   
  'XDC'
]
```



3. Category: Choose between:
```
[
  'AI',
  'BLOCKCHAIN_INFRA',
  'COMPUTE',
  'ENERGY',
  'NOT_DEPIN',
  'OTHER',
  'PENDING',
  'RWA',
  'SENSORS',
  'SERVICES',
  'WIRELESS'
]
```
4. Subcategory: Choose between: 
```
Subcategories: [
  'Advertising',           'Agents',            'App',
  'Apps',                  'Batteries',         'Bridges',
  'CDN',                   'Chatbot',           'Data',
  'DeFi',                  'DeSci',             'Drones',
  'Environmental',         'FHE',               'GPUs',
  'Gaming',                'Gov',               'Hardware',
  'Health & Fitness',      'Identity',          'Inferencing',
  'Intellectual Property', 'IoT',               'L1/L2',
  'Labor',                 'Legal',             'ML',
  'Manufacturing',         'Mining',            'Mobile',
  'Mobility',              'NFTs',              'Oracle',
  'Positioning',           'Prediction Market', 'Private Wireless',
  'Quantum',               'RPC/Indexing',      'RWA',
  'Rewards',               'Robotics',          'Satellites',
  'Smart Home',            'Social',            'Software',
  'Storage',               'TEE',               'Telegram',
  'Training',              'VPN',               'VPP',
  'W. L.',                 'Wallet',            'ZK'
]
```
5. Token: ticker (e.g., 'BTC' or 'ETH')
6. CoingeckoID: Find on CoinGecko project page (in URL).
7. CmCID: Find on CoinMarketCap project page (in image URL of project icon).
8. ID: Generate in Step #6 below.

## Preparing a Pull Request

Try not to include more than one project/issue in a single PR. It's much easier for us to review
multiple small pull requests than one that is large and unwieldy.

1. [Fork the repository](https://docs.github.com/en/free-pro-team@latest/github/getting-started-with-github/fork-a-repo).

2. Clone the fork to your local machine and add upstream remote:

```sh
git clone https://github.com/<your username>/adapters.git
cd adapters
git remote add upstream https://github.com/ev3-team/adapters.git
```

3. Synchronize your local `staging` branch with the upstream remote:

```sh
git checkout staging
git pull upstream staging
```

4. Install dependencies with [pnpm](https://pnpm.io/):

```sh
pnpm i
```

5. Create a new branch related to your PR:

```sh
git checkout -b project/<project-name>
```

6. Copy & rename an existing project folder, then fill out the relevant datapoints.

7. Generate new uniqueID and paste in into the new project file:

```sh
pnpm generate:project-id
```

7. Then commit and push to your forked repository:

```sh
git push -u origin HEAD
```

8. Go to [the repository](https://github.com/ev3-team/adapters) and
   [make a Pull Request](https://docs.github.com/en/free-pro-team@latest/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request).

9. We will review your Pull Request and either merge it, request changes to it, or close it with an
   explanation. Please email ninja@ev3.xyz with any questions.

## Publishing a new version

In order to see the changes reflected in the frontend you'll have to publish a new package version, we are using changeset and github actions to do this, you can follow the next steps if you want to publish a new version:

- Make sure you’re in staging branch with latest changes: `git checkout staging && git pull`
- Run `pnpm changeset` and fill in the two fields: 1. What kind of change is this.. and 2. Summary confirm changeset. (this step will generate a .md file in the .changeset folder )
- Then run `pnpm changeset version` this command will use the generated .md file to update the package.json with the new version and the update the CHANGELOG.md file with the new version description.
- Then commit and push this changes to staging.
- After you have all your changes ready to publish then merge staging into main, this step will trigger the publish ci job.

## Contribute from a browser IDE

Make changes and contribute in a single click with an **already setup and ready to code developer environment** using Gitpod !

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/?autostart=true#https://github.com/ev3-team/adapters)
