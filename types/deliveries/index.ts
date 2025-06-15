// Delivery-related TypeScript interfaces
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
  
  export interface RecipientDetails {
    name: string
    phone: string
  }
  
  export interface RouteFeature {
    type: string
    geometry: {
      type: string
      coordinates: number[][] | number[]
    }
    properties?: {
      event?: string
      userId?: string
      timeStamp?: string
    }
  }
  
  export interface Route {
    type: string
    features: RouteFeature[]
  }
  
  export interface Delivery {
    _id: string
    userId: User
    driverId: User
    type: string
    pickupLocation: GeoPoint
    destination: GeoPoint
    pickupTime: string
    recipientDetails: RecipientDetails
    itemDescription: string
    itemPhotoURL: string
    vehicleType: string
    fare: PriceObject
    tax: PriceObject
    discount: PriceObject
    totalFare: PriceObject
    status: string
    cancellationReason: string
    code: string
    route: Route
    createdAt: string
    updatedAt: string
  }
  
  export interface DeliveryFilters {
    search?: string
    status?: string
    type?: string
    vehicleType?: string
    driverId?: string
    startDate?: string
    endDate?: string
    minFare?: number
    maxFare?: number
    code?: string
    recipientPhone?: string
  }
  
  export interface PaginationData {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  