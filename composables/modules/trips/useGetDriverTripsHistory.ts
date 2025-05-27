import { ref } from "vue"
import { trips_api } from "@/api_factory/modules/trips"
import { useCustomToast } from "@/composables/core/useCustomToast"

interface PaginationData {
  page: number
  limit: number
  total: number
  totalPages: number
}

export const useGetDriverTripHistory = () => {
  const loading = ref(false)
  const driverTripHistory = ref([])
  const { showToast } = useCustomToast()
  const route = useRoute()
  const pagination = ref<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  })

  const fetchDriverTripHistory = async (page = 1, limit = 10) => {
    loading.value = true
    try {
      const res = (await trips_api.$_fetch_driver_trip_history(route.params.id, page, limit)) as any
      console.log(res, 'tres here')
      if (res.type !== "ERROR") {
        driverTripHistory.value = res?.data?.trips
        pagination.value = {
          page: res?.data?.page || 1,
          limit: res?.data?.limit || 10,
          total: res?.data?.total || 0,
          totalPages: res?.data?.totalPages || 1,
        }
        return res?.data?.trips || []
      } else {
        showToast({
          title: "Error",
          message: res?.data?.error || "Failed to fetch driver trip history",
          toastType: "error",
          duration: 3000,
        })
        driverTripHistory.value = []
        return []
      }
    } catch (error: any) {
      showToast({
        title: "Error",
        message: error?.message || "Something went wrong",
        toastType: "error",
        duration: 3000,
      })
      driverTripHistory.value = []
      return []
    } finally {
      loading.value = false
    }
  }

  const changePage = async (page: number) => {
    await fetchDriverTripHistory(page, pagination.value.limit)
  }

  const changeLimit = async (limit: number) => {
    await fetchDriverTripHistory(1, limit)
  }

  onMounted(() => {
    fetchDriverTripHistory()
  })

  return {
    loading,
    driverTripHistory,
    pagination: readonly(pagination),
    fetchDriverTripHistory,
    changePage,
    changeLimit
  }
}
