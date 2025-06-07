import { ref } from "vue"
import { deliveries_api } from "@/api_factory/modules/deliveries"
import { useCustomToast } from "@/composables/core/useCustomToast"

export const useGetDeliveryById = () => {
  const loading = ref(false)
  const delivery = ref(null)
  const { showToast } = useCustomToast()
  const route = useRoute()

  const fetchDeliveryById = async () => {
    loading.value = true
    try {
      const res = (await deliveries_api.$_fetch_deliveries_by_id(route.params.id)) as any
      if (res.type !== "ERROR") {
        delivery.value = res.data
        return res.data
      } else {
        showToast({
          title: "Error",
          message: res?.data?.error || "Failed to fetch delivery details",
          toastType: "error",
          duration: 3000,
        })
        return null
      }
    } catch (error: any) {
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
    delivery,
    fetchDeliveryById
  }
}
