import { ref } from "vue"
import { drivers_api } from "@/api_factory/modules/drivers"
import { useCustomToast } from "@/composables/core/useCustomToast"

export const useEnableDriverAccount = () => {
  const loading = ref(false)
  const { showToast } = useCustomToast()

  const enableAccount = async (id: string) => {
    loading.value = true
    try {
      const res = await drivers_api.$_enable_account(id) as any
      if (res.type !== "ERROR") {
        showToast({
          title: "Success",
          message: "Driver account has been enabled",
          toastType: "success",
          duration: 3000,
        })
        return true
      } else {
        showToast({
          title: "Error",
          message: res?.data?.error || "Failed to enable account",
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
    enableAccount,
  }
}
