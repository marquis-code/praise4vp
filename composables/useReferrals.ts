import { ref, readonly } from "vue"
import type { Referral, ReferralStats, PaginatedResponse } from "~/types/referral"

export const useReferrals = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Mock API base URL - replace with your actual API
  const API_BASE = "https://api.yourapp.com"

  const handleError = (err: any) => {
    console.error("API Error:", err)
    error.value = err.message || "An error occurred"
    throw err
  }

  const getAllReferrals = async (page = 1, limit = 10, search = ""): Promise<PaginatedResponse<Referral>> => {
    loading.value = true
    error.value = null

    try {
      // Mock data for demonstration
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockReferrals: Referral[] = Array.from({ length: 50 }, (_, i) => ({
        _id: `ref_${i + 1}`,
        referrer: {
          _id: `user_${i + 1}`,
          firstName: ["John", "Jane", "Mike", "Sarah", "David"][i % 5],
          lastName: ["Doe", "Smith", "Johnson", "Brown", "Wilson"][i % 5],
          email: `user${i + 1}@example.com`,
        },
        referree: {
          _id: `ref_user_${i + 1}`,
          firstName: ["Alice", "Bob", "Charlie", "Diana", "Eve"][i % 5],
          lastName: ["Anderson", "Taylor", "Moore", "Jackson", "White"][i % 5],
          email: `referred${i + 1}@example.com`,
        },
        referralCode: `CM-${Math.random().toString(36).substring(2, 8)}`,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      }))

      const filteredReferrals = search
        ? mockReferrals.filter(
            (r) =>
              r.referrer.firstName.toLowerCase().includes(search.toLowerCase()) ||
              r.referrer.lastName.toLowerCase().includes(search.toLowerCase()) ||
              r.referrer.email.toLowerCase().includes(search.toLowerCase()) ||
              r.referralCode.toLowerCase().includes(search.toLowerCase()),
          )
        : mockReferrals

      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedData = filteredReferrals.slice(startIndex, endIndex)

      return {
        data: paginatedData,
        total: filteredReferrals.length,
        page,
        limit,
        totalPages: Math.ceil(filteredReferrals.length / limit),
      }
    } catch (err) {
      handleError(err)
    } finally {
      loading.value = false
    }
  }

  const getReferralById = async (id: string): Promise<Referral | null> => {
    loading.value = true
    error.value = null

    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Mock single referral
      const mockReferral: Referral = {
        _id: id,
        referrer: {
          _id: "6882363af4981986aa991194",
          firstName: "Adrian",
          lastName: "Wock",
          email: "adrian@gmail.com",
        },
        referree: {
          _id: "6884ebbe4b72b899fefd0e4c",
          firstName: "Ref",
          lastName: "Collins",
          email: "ref@gmail.com",
        },
        referralCode: "CM-ksQpeX",
        createdAt: "2025-07-26T14:53:30.494Z",
        updatedAt: "2025-07-26T14:53:30.494Z",
      }

      return mockReferral
    } catch (err) {
      handleError(err)
    } finally {
      loading.value = false
    }
  }

  const getReferralsByUserId = async (userId: string, page = 1, limit = 10): Promise<PaginatedResponse<Referral>> => {
    loading.value = true
    error.value = null

    try {
      await new Promise((resolve) => setTimeout(resolve, 800))

      const mockReferrals: Referral[] = Array.from({ length: 15 }, (_, i) => ({
        _id: `user_ref_${i + 1}`,
        referrer: {
          _id: userId,
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
        },
        referree: {
          _id: `referred_${i + 1}`,
          firstName: ["Alice", "Bob", "Charlie", "Diana", "Eve"][i % 5],
          lastName: ["Anderson", "Taylor", "Moore", "Jackson", "White"][i % 5],
          email: `referred${i + 1}@example.com`,
        },
        referralCode: `CM-${Math.random().toString(36).substring(2, 8)}`,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      }))

      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedData = mockReferrals.slice(startIndex, endIndex)

      return {
        data: paginatedData,
        total: mockReferrals.length,
        page,
        limit,
        totalPages: Math.ceil(mockReferrals.length / limit),
      }
    } catch (err) {
      handleError(err)
    } finally {
      loading.value = false
    }
  }

  const getReferralStats = async (startDate?: string, endDate?: string): Promise<ReferralStats> => {
    loading.value = true
    error.value = null

    try {
      await new Promise((resolve) => setTimeout(resolve, 600))

      const mockStats: ReferralStats = {
        totalReferrals: 1247,
        totalUsers: 892,
        recentReferrals: 45,
        topReferrers: [
          {
            user: { _id: "1", firstName: "John", lastName: "Doe", email: "john@example.com" },
            count: 23,
          },
          {
            user: { _id: "2", firstName: "Jane", lastName: "Smith", email: "jane@example.com" },
            count: 18,
          },
          {
            user: { _id: "3", firstName: "Mike", lastName: "Johnson", email: "mike@example.com" },
            count: 15,
          },
        ],
      }

      return mockStats
    } catch (err) {
      handleError(err)
    } finally {
      loading.value = false
    }
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    getAllReferrals,
    getReferralById,
    getReferralsByUserId,
    getReferralStats,
  }
}
