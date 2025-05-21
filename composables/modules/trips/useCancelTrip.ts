import { ref } from "vue"
import { trips_api } from "@/api_factory/modules/trips"
import { useCustomToast } from "@/composables/core/useCustomToast"

export const useCancelTrip = () => {
  const loading = ref(false)
  const { showToast } = useCustomToast()

  const cancelTrip = async (id: string) => {
    loading.value = true
    try {
      const res = await trips_api.$_cancel_trip(id) as any
      if (res.type !== "ERROR") {
        showToast({
          title: "Success",
          message: "Trip was cancelled successfully",
          toastType: "success",
          duration: 3000,
        })
        return true
      } else {
        showToast({
          title: "Error",
          message: res?.data?.error || "Failed to cancel trip",
          toastType: "error",
          duration: 3000,
        })
        return false
      }
    } catch (error: any) {
      showToast({
        title: "Error",
        message: error?.message || "Something went wrong",
        toastType: "error",
        duration: 3000,
      })
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    cancelTrip,
  }
}
