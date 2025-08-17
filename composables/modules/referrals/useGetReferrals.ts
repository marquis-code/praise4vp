// src/composables/referrals/useGetReferrals.ts
import { ref, readonly, onMounted, watch } from "vue"
import { referral_api } from "@/api_factory/modules/referrals"
import { useCustomToast } from "@/composables/core/useCustomToast"

interface PaginationData {
  page: number
  limit: number
  total: number
  totalPages: number
}

export const useGetReferrals = () => {
  const loading = ref(false)
  const referrals = ref<any[]>([])
  const search = ref<string>("")
  const pagination = ref<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  })

  const { showToast } = useCustomToast()

  const fetchReferrals = async (page = pagination.value.page, limit = pagination.value.limit, q = search.value) => {
    loading.value = true
    try {
      const params = Object.fromEntries(
        Object.entries({ page, limit, q }).filter(([, v]) => v !== undefined && v !== null && v !== "")
      )

      const res = await referral_api.$_get_all_referrals(params as any)

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
        message: error?.message || "Failed to fetch referrals",
        toastType: "error",
        duration: 3000,
      })
      referrals.value = []
      return []
    } finally {
      loading.value = false
    }
  }

  const changePage = async (page: number) => {
    pagination.value.page = page
    await fetchReferrals(page, pagination.value.limit, search.value)
  }

  const changeLimit = async (limit: number) => {
    pagination.value.limit = limit
    pagination.value.page = 1
    await fetchReferrals(1, limit, search.value)
  }

  const setSearch = async (q: string) => {
    search.value = q
    pagination.value.page = 1
    await fetchReferrals(1, pagination.value.limit, q)
  }

  watch(
    () => [pagination.value.page, pagination.value.limit],
    async ([newPage, newLimit], [oldPage, oldLimit]) => {
      if (oldPage !== undefined && oldLimit !== undefined) {
        if (newPage !== oldPage || newLimit !== oldLimit) {
          await fetchReferrals(newPage, newLimit, search.value)
        }
      }
    }
  )

  onMounted(() => {
    fetchReferrals()
  })

  return {
    loading,
    referrals,
    search,
    pagination: readonly(pagination),
    fetchReferrals,
    changePage,
    changeLimit,
    setSearch,
  }
}
