import { GATEWAY_ENDPOINT } from '../axios.config'

export const drivers_api = {
     $_get_drivers: () => {
        const url = '/drivers'
        return GATEWAY_ENDPOINT.get(url)
    },
    $_get_driver_by_id: (id: string) => {
        const url = `/drivers/${id}`
        return GATEWAY_ENDPOINT.get(url)
    }
}
