import { GATEWAY_ENDPOINT } from '../axios.config'

export const dashboard_api = {
     $_dashboard_stats: () => {
        const url = '/dashboard'
        return GATEWAY_ENDPOINT.get(url)
    }
}
