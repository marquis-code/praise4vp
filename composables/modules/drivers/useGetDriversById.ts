import { ref } from "vue"
import { drivers_api } from "@/api_factory/modules/drivers"
import { useCustomToast } from "@/composables/core/useCustomToast"

export const useGetDriverById = () => {
  const loading = ref(false)
  const driver = ref(null)
  const { showToast } = useCustomToast()
  const route = useRoute()

  const fetchDriverById = async () => {
    loading.value = true
    try {
      const res = (await drivers_api.$_get_driver_by_id(route.params.id)) as any
      if (res.type !== "ERROR") {
        driver.value = res.data
        return res.data
      } else {
        showToast({
          title: "Error",
          message: res?.data?.error || "Failed to fetch driver details",
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

  onMounted(() => {
    fetchDriverById()
  })

  return {
    loading,
    driver,
    fetchDriverById
  }
}
