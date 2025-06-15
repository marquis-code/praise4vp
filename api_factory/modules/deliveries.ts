// import { GATEWAY_ENDPOINT } from '../axios.config'

// export const deliveries_api = {
//   $_fetch_deliveries: () => {
//     const url = '/deliveries'
//     return GATEWAY_ENDPOINT.get(url)
//   },
//   $_fetch_deliveries_by_id: (id) => {
//     const url = `/deliveries/${id}`
//     return GATEWAY_ENDPOINT.get(url)
//   },
//   $_fetch_user_deliveries: (id) => {
//     const url = `/deliveries/users/${route?.params?.id}`
//     return GATEWAY_ENDPOINT.get(url)
//   },
//   $_fetch_drivers_deliveries: (id) => {
//     const url = `/deliveries/drivers/${route?.params?.id}`
//     return GATEWAY_ENDPOINT.get(url)
//   }
// }


import { GATEWAY_ENDPOINT } from "../axios.config"
import type { DeliveryFilters } from "~/types/delivery"

interface GetDeliveriesParams extends DeliveryFilters {
  page?: number
  limit?: number
}

export const deliveries_api = {
  $_fetch_deliveries: (params: GetDeliveriesParams = {}) => {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      type,
      vehicleType,
      driverId,
      startDate,
      endDate,
      minFare,
      maxFare,
      code,
      recipientPhone,
    } = params

    // Build query parameters object, only including defined values
    const queryParams: Record<string, string | number> = {
      page,
      limit,
    }

    // Add optional parameters only if they exist
    if (search) queryParams.search = search
    if (status) queryParams.status = status
    if (type) queryParams.type = type
    if (vehicleType) queryParams.vehicleType = vehicleType
    if (driverId) queryParams.driverId = driverId
    if (startDate) queryParams.startDate = startDate
    if (endDate) queryParams.endDate = endDate
    if (minFare) queryParams.minFare = minFare
    if (maxFare) queryParams.maxFare = maxFare
    if (code) queryParams.code = code
    if (recipientPhone) queryParams.recipientPhone = recipientPhone

    // Convert to URL search params
    const searchParams = new URLSearchParams()
    Object.entries(queryParams).forEach(([key, value]) => {
      searchParams.append(key, String(value))
    })

    const url = `/deliveries?${searchParams.toString()}`
    return GATEWAY_ENDPOINT.get(url)
  },

  $_fetch_delivery_by_id: (id: string) => {
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
  },

  $_update_delivery_status: (id: string, status: string, reason?: string) => {
    const url = `/deliveries/${id}/status`
    return GATEWAY_ENDPOINT.patch(url, { status, reason })
  },

  $_cancel_delivery: (id: string, reason: string) => {
    const url = `/deliveries/${id}/cancel`
    return GATEWAY_ENDPOINT.post(url, { reason })
  },
}
