import { ref } from "vue"
import { passengers_api } from "@/api_factory/modules/passengers"
import { useCustomToast } from "@/composables/core/useCustomToast"

export const useGetPassengers = () => {
  const loading = ref(false)
  const passengers = ref([])
  const { showToast } = useCustomToast()

  const fetchPassengers = async () => {
    loading.value = true
    try {
      const res = (await passengers_api.$_get_passengers()) as any
      if (res.type !== "ERROR") {
        passengers.value = res?.data?.data
        return res?.data?.data
      } else {
        showToast({
          title: "Error",
          message: res?.data?.error || "Failed to fetch passengers",
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
    fetchPassengers()
  })

  return {
    loading,
    passengers,
    fetchPassengers,
  }
}
