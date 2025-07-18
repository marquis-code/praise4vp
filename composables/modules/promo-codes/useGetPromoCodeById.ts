import { ref } from "vue"
import { promo_code_api } from "@/api_factory/modules/promo-code"
import { useCustomToast } from "@/composables/core/useCustomToast"
import { useRoute } from "vue-router"

export const useGetPromoCodeById = () => {
  const loading = ref(false)
  const promoCode = ref(null)
  const { showToast } = useCustomToast()
  const route = useRoute()

  const fetchPromoCodeById = async (id: string) => {
    loading.value = true
    try {
      const res = await promo_code_api.$_get_promo_code_by_id(id)
      if (res.type !== "ERROR") {
        promoCode.value = res.data
        return res.data
      } else {
        showToast({
          title: "Error",
          message: res?.data?.error || "Failed to fetch promo code details",
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
    promoCode,
    fetchPromoCodeById,
  }
}
