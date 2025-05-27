import { ref } from "vue"
import { passengers_api } from "@/api_factory/modules/passengers"
import { useCustomToast } from "@/composables/core/useCustomToast"

interface PaginationData {
  page: number
  limit: number
  total: number
  totalPages: number
}

export const useGetPassengers = () => {
  const loading = ref(false)
  const passengers = ref([])
  const pagination = ref<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  })
  const { showToast } = useCustomToast()

  const fetchPassengers = async (page = 1, limit = 10) => {
    loading.value = true
    try {
      const res = (await passengers_api.$_get_passengers(page, limit)) as any
      if (res.type !== "ERROR") {
        passengers.value = res?.data?.data
        pagination.value = {
          page: res?.data?.meta?.page || 1,
          limit: res?.data?.meta?.limit || 10,
          total: res?.data?.meta?.total || 0,
          totalPages: res?.data?.meta?.totalPages || 1,
        }
        return res.data.data || []
      } else {
        showToast({
          title: "Error",
          message: res?.data?.error || "Failed to fetch passengers",
          toastType: "error",
          duration: 3000,
        })
        passengers.value = []
        return []
      }
    } catch (error: any) {
      showToast({
        title: "Error",
        message: error?.message || "Something went wrong",
        toastType: "error",
        duration: 3000,
      })
      passengers.value = []
      return []
    } finally {
      loading.value = false
    }
  }

  const changePage = async (page: number) => {
    await fetchPassengers(page, pagination.value.limit)
  }

  const changeLimit = async (limit: number) => {
    await fetchPassengers(1, limit)
  }

  onMounted(() => {
    fetchPassengers()
  })

  return {
    loading,
    passengers,
    pagination: readonly(pagination),
    fetchPassengers,
    changePage,
    changeLimit,
  }
}
