import { ref } from "vue"
import { promo_code_api } from "@/api_factory/modules/promo-code"
import { useCustomToast } from "@/composables/core/useCustomToast"

export const useGetAllPromoCodes = () => {
  const loading = ref(false)
  const promoCodes = ref([])
  const { showToast } = useCustomToast()

  const fetchAllPromoCodes = async (params?: any) => {
    loading.value = true
    try {
      const res = await promo_code_api.$_get_all_promo_codes(params)
      console.log(res, 'promo list')
      if (res.type !== "ERROR") {
        promoCodes.value = res.data.data
        return res.data.data
      } else {
        showToast({
          title: "Error",
          message: res?.data?.error || "Failed to fetch promo codes",
          toastType: "error",
          duration: 3000,
        })
        return []
      }
    } catch (error) {
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
    fetchAllPromoCodes()
  })
  
  return {
    loading,
    promoCodes,
    fetchAllPromoCodes,
  }
}
