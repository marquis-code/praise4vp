import { ref } from "vue"
import { passengers_api } from "@/api_factory/modules/passengers"
import { useCustomToast } from "@/composables/core/useCustomToast"

export const useGetPassengerById = () => {
  const loading = ref(false)
  const passenger = ref(null)
  const { showToast } = useCustomToast()
  const route = useRoute()

  const fetchPassengerById = async () => {
    loading.value = true
    try {
      const res = (await passengers_api.$_get_passenger_by_id(route.params.id)) as any
      if (res.type !== "ERROR") {
        passenger.value = res.data
        return res.data
      } else {
        showToast({
          title: "Error",
          message: res?.data?.error || "Failed to fetch passenger details",
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
    fetchPassengerById()
  })
  
  return {
    loading,
    passenger,
    fetchPassengerById
  }
}
