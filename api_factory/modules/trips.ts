import { GATEWAY_ENDPOINT } from '../axios.config'

export const trips_api = {
     $_fetch_trips: () => {
        const url = '/trips'
        return GATEWAY_ENDPOINT.get(url)
    },
    $_fetch_trip_by_id: (id: string) => {
        const url = `/trips/${id}`
        return GATEWAY_ENDPOINT.get(url)
    },
    $_fetch_driver_trip_history: (id: string) => {
        let url = `/trips/drivers/${id}`
        return GATEWAY_ENDPOINT.get(url)
    },
    $_fetch_passenger_trip_history: (id: string) => {
        let url = `/trips/passengers/${id}`
        return GATEWAY_ENDPOINT.get(url)
    },
    $_cancel_trip: (id: string) => {
         const url = `/trips/${id}/cancel-trip`
        return GATEWAY_ENDPOINT.get(url)
    },
    $_reschedule_trip: (id: string) => {
        const url = `/trips/${id}/reschedule-trip`
       return GATEWAY_ENDPOINT.patch(url)
   }
}
