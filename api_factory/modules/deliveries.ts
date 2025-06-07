import { GATEWAY_ENDPOINT } from '../axios.config'

export const deliveries_api = {
  $_fetch_deliveries: () => {
    const url = '/deliveries'
    return GATEWAY_ENDPOINT.get(url)
  },
  $_fetch_deliveries_by_id: (id) => {
    const url = `/deliveries/${id}`
    return GATEWAY_ENDPOINT.get(url)
  },
  $_fetch_user_deliveries: (id) => {
    const url = `/deliveries/users/${route?.params?.id}`
    return GATEWAY_ENDPOINT.get(url)
  },
  $_fetch_drivers_deliveries: (id) => {
    const url = `/deliveries/drivers/${route?.params?.id}`
    return GATEWAY_ENDPOINT.get(url)
  }
}
