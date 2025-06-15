// Trip-related TypeScript interfaces
export interface PriceObject {
    priceInCAD: number
    priceInUserCurrency: number
    rate: number
    rateTimestamp: string
    currencySymbol: string
    currencyName: string
    attribution: string
  }
  
  export interface User {
    _id: string
    firstName: string
    lastName: string
    email: string
  }
  
  export interface GeoPoint {
    type: string
    geometry: {
      type: string
      coordinates: number[]
    }
    properties: {
      address: string
    }
  }
  
  export interface Passenger {
    _id: string
    passengerId: User
    origin: GeoPoint
    destination: GeoPoint
    fare: PriceObject
    tax: PriceObject
    discount: PriceObject
    totalFare: PriceObject
    passengerStatus: string
    cancellationReason?: string
  }
  
  export interface Trip {
    _id: string
    primaryUserId: User
    driverId: User
    type: string
    isScheduled: boolean
    scheduledFor: string | null
    status: string
    passengers: Passenger[]
    createdAt: string
    updatedAt: string
    isPrivate: boolean
  }
  
  export interface TripFilters {
    search?: string
    status?: string
    type?: string
    isPrivate?: boolean
    isScheduled?: boolean
    startDate?: string
    endDate?: string
  }
  
  export interface PaginationData {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  