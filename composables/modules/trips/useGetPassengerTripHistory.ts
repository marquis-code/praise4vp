import { ref } from "vue"
import { trips_api } from "@/api_factory/modules/trips"
import { useCustomToast } from "@/composables/core/useCustomToast"

export const useGetPassengerTripHistory = () => {
  const loading = ref(false)
  const passengerTripHistory = ref([])
  const { showToast } = useCustomToast()
  const route = useRoute()

  const fetchPassengerTripHistory = async () => {
    loading.value = true
    try {
      const res = (await trips_api.$_fetch_passenger_trip_history(route.params.id)) as any // Note: This is using the same function as driver history in your API
      console.log(res, 'res history ebre')
      if (res.type !== "ERROR") {
        passengerTripHistory.value = res?.data?.trips
        return res?.data?.trips
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

  onMounted(() => {
    fetchPassengerTripHistory()
  })

  return {
    loading,
    passengerTripHistory,
    fetchPassengerTripHistory,
  }
}
