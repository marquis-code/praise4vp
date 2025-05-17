import { ref } from "vue"
import { trips_api } from "@/api_factory/modules/trips"
import { useCustomToast } from "@/composables/core/useCustomToast"

export const useGetDriverTripHistory = () => {
  const loading = ref(false)
  const driverTripHistory = ref([])
  const { showToast } = useCustomToast()
  const route = useRoute()

  const fetchDriverTripHistory = async () => {
    loading.value = true
    try {
      const res = (await trips_api.$_fetch_driver_trip_history(route.params.id)) as any
      if (res.type !== "ERROR") {
        driverTripHistory.value = res?.data?.trips
        return res?.data?.trips
      } else {
        showToast({
          title: "Error",
          message: res?.data?.error || "Failed to fetch driver trip history",
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

  onMounted(() => {
    fetchDriverTripHistory()
  })

  return {
    loading,
    driverTripHistory,
    fetchDriverTripHistory,
  }
}
