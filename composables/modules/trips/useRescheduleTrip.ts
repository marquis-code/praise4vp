import { ref } from "vue"
import { trips_api } from "@/api_factory/modules/trips"
import { useCustomToast } from "@/composables/core/useCustomToast"

export const useRescheduleTrip = () => {
  const loading = ref(false)
  const { showToast } = useCustomToast()

  const rescheduleTrip = async (id: string) => {
    loading.value = true
    try {
      const res = await trips_api.$_reschedule_trip(id) as any
      if (res.type !== "ERROR") {
        showToast({
          title: "Success",
          message: "Trip was re-scheduled successfully",
          toastType: "success",
          duration: 3000,
        })
        return true
      } else {
        showToast({
          title: "Error",
          message: res?.data?.error || "Failed to reschedule trip",
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
    rescheduleTrip,
  }
}
