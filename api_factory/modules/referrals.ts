import { GATEWAY_ENDPOINT } from '../axios.config'

export const referral_api = {
  $_get_all_referrals: (params?: { page?: number; limit?: number; q?: string }) => {
    const url = `/referrals`
    return GATEWAY_ENDPOINT.get(url, { params })
  },

  $_get_referral_by_id: (id: string) => {
    const url = `/referrals/${id}`
    return GATEWAY_ENDPOINT.get(url)
  },

  $_get_referrals_by_user_id: (
    userId: string,
    params?: { page?: number; limit?: number }
  ) => {
    const url = `/referrals/users/${userId}`
    return GATEWAY_ENDPOINT.get(url)
  },

  $_get_referral_stats: (params?: { userId?: string; from?: string; to?: string }) => {
    const url = `/referrals/stats`
    return GATEWAY_ENDPOINT.get(url, { params })
  },
}
