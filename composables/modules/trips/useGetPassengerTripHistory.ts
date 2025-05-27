import { ref } from "vue"
import { trips_api } from "@/api_factory/modules/trips"
import { useCustomToast } from "@/composables/core/useCustomToast"

interface PaginationData {
  page: number
  limit: number
  total: number
  totalPages: number
}

export const useGetPassengerTripHistory = () => {
  const loading = ref(false)
  const passengerTripHistory = ref([])
  const { showToast } = useCustomToast()
  const route = useRoute()

  const pagination = ref<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  })

  const fetchPassengerTripHistory = async (page = 1, limit = 10) => {
    loading.value = true
    try {
      const res = (await trips_api.$_fetch_passenger_trip_history(route.params.id, page, limit)) as any // Note: This is using the same function as driver history in your API
      console.log(res, 'res history ebre')
      if (res.type !== "ERROR") {
        passengerTripHistory.value = res?.data?.trips
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
          message: res?.data?.error || "Failed to fetch passenger trip history",
          toastType: "error",
          duration: 3000,
        })
        return []
      }
    } catch (error: any) {
      showToast({
        title: "Error",
        message: error?.message || "Something went wrong",
        toastType: "error",
        duration: 3000,
      })
      return []
    } finally {
      loading.value = false
    }
  }

  const changePage = async (page: number) => {
    await fetchPassengerTripHistory(page, pagination.value.limit)
  }

  const changeLimit = async (limit: number) => {
    await fetchPassengerTripHistory(1, limit)
  }

  onMounted(() => {
    fetchPassengerTripHistory()
  })

  return {
    loading,
    passengerTripHistory,
    pagination: readonly(pagination),
    fetchPassengerTripHistory,
    changePage,
    changeLimit
  }
}
