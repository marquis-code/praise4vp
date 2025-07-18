import { ref } from "vue"
import { promo_code_api } from "@/api_factory/modules/promo-code"
import { useCustomToast } from "@/composables/core/useCustomToast"

export const useEndPromotion = () => {
  const loading = ref(false)
  const { showToast } = useCustomToast()

  const endPromotion = async (id: string) => {
    loading.value = true
    try {
      const res = await promo_code_api.$_end_promotion(id)
      if (res.type !== "ERROR") {
        return true
      } else {
        showToast({
          title: "Error",
          message: res?.data?.error || "Failed to end promotion",
          toastType: "error",
          duration: 3000,
        })
        return false
      }
    } catch (error) {
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
    endPromotion,
  }
}
