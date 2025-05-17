import { GATEWAY_ENDPOINT } from '../axios.config'

export const passengers_api = {
     $_get_passengers: () => {
        const url = '/passengers'
        return GATEWAY_ENDPOINT.get(url)
    },
    $_get_passenger_by_id: (id: string) => {
        const url = `/passengers/${id}`
        return GATEWAY_ENDPOINT.get(url)
    }
}
