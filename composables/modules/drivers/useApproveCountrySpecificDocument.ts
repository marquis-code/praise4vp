import { ref } from "vue"
import { drivers_api } from "@/api_factory/modules/drivers"
import { useCustomToast } from "@/composables/core/useCustomToast"

export const useApproveCountrySpecificDocument = () => {
  const loading = ref(false)
  const { showToast } = useCustomToast()

  const approveDocument = async (driverId: string, documentCode: string) => {
    loading.value = true
    try {
      const payload = { status: "approved" }
      const res = await drivers_api.$_verify_country_specific_documents(driverId, documentCode, payload) as any

      if (res?.type !== "ERROR") {
        showToast({
          title: "Success",
          message: "Document approved successfully",
          toastType: "success",
          duration: 3000,
        })
        return true
      } else {
        showToast({
          title: "Error",
          message: res?.data?.error || "Failed to approve document",
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
    approveDocument,
  }
}
