import { GATEWAY_ENDPOINT } from '../axios.config'

export const deliveries_api = {
  $_fetch_deliveries: () => {
    const url = '/deliveries'
    return GATEWAY_ENDPOINT.get(url)
  }
}
