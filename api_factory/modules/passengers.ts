import { GATEWAY_ENDPOINT } from '../axios.config'

export const passengers_api = {
     $_get_passengers: (page = 1, limit = 10) => {
        const url = `/passengers?page=${page}&limit=${limit}`
        return GATEWAY_ENDPOINT.get(url)
    },
    $_get_passenger_by_id: (id: string) => {
        const url = `/passengers/${id}`
        return GATEWAY_ENDPOINT.get(url)
    }
}
