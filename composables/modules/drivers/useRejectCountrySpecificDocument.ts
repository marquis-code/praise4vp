import { ref } from "vue"
import { drivers_api } from "@/api_factory/modules/drivers"
import { useCustomToast } from "@/composables/core/useCustomToast"

export const useRejectCountrySpecificDocument = () => {
  const loading = ref(false)
  const { showToast } = useCustomToast()

  const rejectDocument = async (driverId: string, documentCode: string, reason: string) => {
    loading.value = true
    try {
      const payload = {
        status: "declined",
        rejectionReason: reason,
      }

      const res = await drivers_api.$_verify_country_specific_documents(driverId, documentCode, payload) as any

      if (res?.type !== "ERROR") {
        showToast({
          title: "Rejected",
          message: "Document was rejected",
          toastType: "success",
          duration: 3000,
        })
        return true
      } else {
        showToast({
          title: "Error",
          message: res?.data?.error || "Failed to reject document",
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
    rejectDocument,
  }
}
