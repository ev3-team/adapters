export type FundRaiseRoundType =
  | 'Accelerator'
  | 'Preseed'
  | 'Seed'
  | 'Series A'
  | 'Series B'
  | 'Series C'
  | 'Series D'
  | 'Series F'

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
