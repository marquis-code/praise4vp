export interface User {
    _id: string
    firstName: string
    lastName: string
    email: string
  }
  
  export interface Referral {
    _id: string
    referrer: User
    referree: User
    referralCode: string
    createdAt: string
    updatedAt: string
  }
  
  export interface ReferralStats {
    totalReferrals: number
    totalUsers: number
    recentReferrals: number
    topReferrers: Array<{
      user: User
      count: number
    }>
  }
  
  export interface PaginatedResponse<T> {
    data: T[]
    total: number
    page: number
    limit: number
    totalPages: number
  }
  