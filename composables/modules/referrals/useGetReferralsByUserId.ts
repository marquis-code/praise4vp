// src/composables/referrals/useGetReferralsByUserId.ts
import { ref, readonly, onMounted, watch } from "vue"
import { referral_api } from "@/api_factory/modules/referrals"
import { useCustomToast } from "@/composables/core/useCustomToast"

interface PaginationData {
  page: number
  limit: number
  total: number
  totalPages: number
}

export const useGetReferralsByUserId = (initialUserId?: string) => {
  const loading = ref(false)
  const referrals = ref<any[]>([])
  const userId = ref<string | undefined>(initialUserId)
  const pagination = ref<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  })

  const { showToast } = useCustomToast()

  const fetchUserReferrals = async (
    uId = userId.value,
    page = pagination.value.page,
    limit = pagination.value.limit
  ) => {
    if (!uId) return []
    loading.value = true
    try {
      const params = Object.fromEntries(
        Object.entries({ page, limit }).filter(([, v]) => v !== undefined && v !== null && v !== "")
      )

      const res = await referral_api.$_get_referrals_by_user_id(uId, params as any)
      const data = res?.data
      const list =
        data?.referrals ?? data?.results ?? data?.data ?? data?.items ?? []
      referrals.value = Array.isArray(list) ? list : []

      pagination.value = {
        page: Number(data?.page ?? page ?? 1),
        limit: Number(data?.limit ?? limit ?? 10),
        total: Number(data?.total ?? data?.count ?? referrals.value.length ?? 0),
        totalPages: Number(data?.totalPages ?? data?.pages ?? 1),
      }

      return referrals.value
    } catch (error: any) {
      showToast({
        title: "Error",
        message: error?.message || "Failed to fetch user referrals",
        toastType: "error",
        duration: 3000,
      })
      referrals.value = []
      return []
    } finally {
      loading.value = false
    }
  }

  const setUserId = async (uId: string) => {
    userId.value = uId
    pagination.value.page = 1
    await fetchUserReferrals(uId, 1, pagination.value.limit)
  }

  const changePage = async (page: number) => {
    pagination.value.page = page
    await fetchUserReferrals(userId.value, page, pagination.value.limit)
  }

  const changeLimit = async (limit: number) => {
    pagination.value.limit = limit
    pagination.value.page = 1
    await fetchUserReferrals(userId.value, 1, limit)
  }

  watch(
    () => [pagination.value.page, pagination.value.limit],
    async ([newPage, newLimit], [oldPage, oldLimit]) => {
      if (oldPage !== undefined && oldLimit !== undefined) {
        if (newPage !== oldPage || newLimit !== oldLimit) {
          await fetchUserReferrals(userId.value, newPage, newLimit)
        }
      }
    }
  )

  onMounted(() => {
    if (userId.value) fetchUserReferrals(userId.value)
  })

  return {
    loading,
    referrals,
    userId,
    pagination: readonly(pagination),
    setUserId,
    fetchUserReferrals,
    changePage,
    changeLimit,
  }
}
