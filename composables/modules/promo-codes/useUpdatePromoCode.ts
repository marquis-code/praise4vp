import { ref } from "vue"
import { promo_code_api } from "@/api_factory/modules/promo-code"
import { useCustomToast } from "@/composables/core/useCustomToast"

export const useUpdatePromoCode = () => {
  const loading = ref(false)
  const { showToast } = useCustomToast()

  const handleUpdatePromo = async (id: any, payload: Record<string, any>) => {
    loading.value = true
    try {
      const res = await promo_code_api.$_update_promo_code(id, payload)
      if (res.type !== "ERROR") {
        return res.data
      } else {
        showToast({
          title: "Error",
          message: res?.data?.error || "Failed to update promo code",
          toastType: "error",
          duration: 3000,
        })
        return null
      }
    } catch (error) {
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

  return {
    loading,
    handleUpdatePromo
  }
}
