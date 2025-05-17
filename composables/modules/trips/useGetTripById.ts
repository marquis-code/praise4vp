import { ref } from "vue"
import { trips_api } from "@/api_factory/modules/trips"
import { useCustomToast } from "@/composables/core/useCustomToast"

export const useGetTripById = () => {
  const loading = ref(false)
  const trip = ref(null)
  const { showToast } = useCustomToast()
  const route = useRoute()

  const fetchTripById = async () => {
    loading.value = true
    try {
      const res = (await trips_api.$_fetch_trip_by_id(route.params.id)) as any
      if (res.type !== "ERROR") {
        trip.value = res.data
        return res.data
      } else {
        showToast({
          title: "Error",
          message: res?.data?.error || "Failed to fetch trip details",
          toastType: "error",
          duration: 3000,
        })
        return null
      }
    } catch (error: any) {
      showToast({
        title: "Error",
        message: error?.message || "Something went wrong",
        toastType: "error",
        duration: 3000,
      })
      return null
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchTripById()
  })

  return {
    loading,
    trip,
    fetchTripById,
  }
}
