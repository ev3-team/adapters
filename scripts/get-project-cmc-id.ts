export type Result = {
  status: {
    timestamp: string
    error_code: number
    error_message: any
    elapsed: number
    credit_count: number
    notice: any
  }
  data: {
    [projectId: string]: {
      id: number
      name: string
      symbol: string
      category: string
      description: string
      slug: string
      logo: string
      subreddit: string
      notice: string
      tags: Array<string>
      'tag-names': Array<string>
      'tag-groups': Array<string>
      urls: {
        website: Array<string>
        twitter: Array<string>
        message_board: Array<any>
        chat: Array<string>
        facebook: Array<any>
        explorer: Array<string>
        reddit: Array<any>
        technical_doc: Array<string>
        source_code: Array<string>
        announcement: Array<string>
      }
      platform: {
        id: string
        name: string
        slug: string
        symbol: string
        token_address: string
      }
      date_added: string
      twitter_username: string
      is_hidden: number
      date_launched: string
      contract_address: Array<{
        contract_address: string
        platform: {
          name: string
          coin: {
            id: string
            name: string
            symbol: string
            slug: string
          }
        }
      }>
      self_reported_circulating_supply: number
      self_reported_tags: Array<string>
      self_reported_market_cap: number
      infinite_supply: boolean
    }
  }
}

export async function getProjectCmcIdBySlug(slugs: string[]) {
  const headers = new Headers()
  headers.append('X-CMC_PRO_API_KEY', 'ed009e62-583a-42cf-89c2-d177580381fc')
  headers.append('Accept', '*/*')

  try {
    const response = await fetch(
      `https://pro-api.coinmarketcap.com/v2/cryptocurrency/info?slug=${slugs.join(',')}`,
      { headers }
    )
    const result: Result = await response.json()
    const ids = new Map<string, number>()
    Object.entries(result.data).forEach(([_, data]) => {
      ids.set(data.slug, data.id)
    })
    return ids
  } catch (error) {
    console.error('[getProjectCmcIdBySlug] There was an error fetching cmc ids, ', error)

    return null
  }
}
