import { ref } from "vue"
import { trips_api } from "@/api_factory/modules/trips"
import { useCustomToast } from "@/composables/core/useCustomToast"

export const useGetTrips = () => {
  const loading = ref(false)
  const trips = ref([])
  const { showToast } = useCustomToast()

  const fetchTrips = async () => {
    loading.value = true
    try {
      const res = (await trips_api.$_fetch_trips()) as any
      if (res.type !== "ERROR") {
        trips.value = res.data.data
        return res.data.data
      } else {
        showToast({
          title: "Error",
          message: res?.data?.error || "Failed to fetch trips",
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
    fetchTrips()
  })

  return {
    loading,
    trips,
    fetchTrips,
  }
}
