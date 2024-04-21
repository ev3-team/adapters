export type FundRaiseRoundType =
  | 'Accelerator'
  | 'Preseed'
  | 'Seed'
  | 'Series A'
  | 'Series B'
  | 'Series C'
  | 'Series D'
  | 'Series F'
  | 'Strategic'
  | 'Angel'
  | 'Private Token Sale'
  | 'Public sale'
  | 'Pre-Series A'
  | 'Grants'
  | ''

export type FundRaiseRow = {
  projectName: string
  projectId: string
  roundType: FundRaiseRoundType
  roundDate: string
  raiseAmount: string
  sourceEuropeanUnionRL: string
  investors: string
  investorsIds: string
}
