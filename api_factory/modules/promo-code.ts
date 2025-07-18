import { GATEWAY_ENDPOINT } from '../axios.config'

export const promo_code_api = {
    $_create_promo_code: (payload: Record<string, any>) => {
        const url = `/promo-codes`
        return GATEWAY_ENDPOINT.post(url, payload)
    },

    $_get_all_promo_codes: (params?: { page?: number; limit?: number }) => {
        const url = `/promo-codes`
        return GATEWAY_ENDPOINT.get(url, { params })
    },

    $_get_promo_code_by_id: (id: string) => {
        const url = `/promo-codes/${id}`
        return GATEWAY_ENDPOINT.get(url)
    },

    $_update_promo_code: (id: string, payload: Partial<Record<string, any>>) => {
        const url = `/promo-codes/${id}`
        return GATEWAY_ENDPOINT.patch(url, payload)
    },

    $_end_promotion: (id: string) => {
        const url = `/promo-codes/${id}`
        return GATEWAY_ENDPOINT.delete(url)
    }
}
