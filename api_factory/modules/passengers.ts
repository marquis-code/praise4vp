import { GATEWAY_ENDPOINT } from "../axios.config"

interface GetPassengersParams {
  page?: number
  limit?: number
  search?: string
  startDate?: string
  endDate?: string
  status?: "active" | "inactive"
  authProvider?: string
  verificationStatus?: string
  emailVerified?: string
}

export const passengers_api = {
  $_get_passengers: (params: GetPassengersParams = {}) => {
    const {
      page = 1,
      limit = 10,
      search,
      startDate,
      endDate,
      status,
      authProvider,
      verificationStatus,
      emailVerified,
    } = params

    // Build query parameters object, only including defined values
    const queryParams: Record<string, string | number> = {
      page,
      limit,
    }

    // Add optional parameters only if they exist
    if (search) queryParams.search = search
    if (startDate) queryParams.startDate = startDate
    if (endDate) queryParams.endDate = endDate
    if (status) queryParams.status = status
    if (authProvider) queryParams.authProvider = authProvider
    if (verificationStatus) queryParams.verificationStatus = verificationStatus
    if (emailVerified) queryParams.emailVerified = emailVerified

    // Convert to URL search params
    const searchParams = new URLSearchParams()
    Object.entries(queryParams).forEach(([key, value]) => {
      searchParams.append(key, String(value))
    })

    const url = `/passengers?${searchParams.toString()}`
    return GATEWAY_ENDPOINT.get(url)
  },

  $_get_passenger_by_id: (id: string) => {
    const url = `/passengers/${id}`
    return GATEWAY_ENDPOINT.get(url)
  },

  $_update_passenger: (id: string, data: any) => {
    const url = `/passengers/${id}`
    return GATEWAY_ENDPOINT.put(url, data)
  },

  $_disable_passenger: (id: string) => {
    const url = `/passengers/${id}/disable`
    return GATEWAY_ENDPOINT.post(url)
  },

  $_enable_passenger: (id: string) => {
    const url = `/passengers/${id}/enable`
    return GATEWAY_ENDPOINT.post(url)
  },
}
