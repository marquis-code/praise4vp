import { ref, onMounted, readonly } from "vue"
import { trips_api } from "@/api_factory/modules/trips"
import { useCustomToast } from "@/composables/core/useCustomToast"

interface PaginationData {
  page: number
  limit: number
  total: number
  totalPages: number
}

export const useGetTrips = () => {
  const loading = ref(false)
  const trips = ref([])
  const pagination = ref<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  })
  const { showToast } = useCustomToast()

  const fetchTrips = async (page = 1, limit = 10) => {
    loading.value = true
    try {
      const res = (await trips_api.$_fetch_trips(page, limit)) as any
      console.log(res?.data?.meta, 'trips res here')
      if (res.type !== "ERROR") {
        trips.value = res.data.data || []
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
          message: res?.data?.error || "Failed to fetch trips",
          toastType: "error",
          duration: 3000,
        })
        trips.value = []
        return []
      }
    } catch (error: any) {
      showToast({
        title: "Error",
        message: error?.message || "Something went wrong",
        toastType: "error",
        duration: 3000,
      })
      trips.value = []
      return []
    } finally {
      loading.value = false
    }
  }

  const changePage = async (page: number) => {
    await fetchTrips(page, pagination.value.limit)
  }

  const changeLimit = async (limit: number) => {
    await fetchTrips(1, limit)
  }

  onMounted(() => {
    fetchTrips()
  })

  return {
    loading,
    trips,
    pagination: readonly(pagination),
    fetchTrips,
    changePage,
    changeLimit,
  }
}
