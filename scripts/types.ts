export enum EnumFundRaiseRoundType {
  ACCELERATOR = 'Accelerator',
  PRE_SEED = 'Preseed',
  SEED = 'Seed',
  SERIES_A = 'Series A',
  SERIES_B = 'Series B',
  SERIES_C = 'Series C',
  SERIES_D = 'Series D',
  SERIES_F = 'Series F',
  STRATEGIC_ANGEL = 'Strategic/Angel',
  TOKEN_SALE = 'Private/Public token sale',
}

export type FundRaiseRoundType = `${EnumFundRaiseRoundType}`

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
