import { ref } from "vue"
import { drivers_api } from "@/api_factory/modules/drivers"
import { useCustomToast } from "@/composables/core/useCustomToast"

export const useGetDrivers = () => {
  const loading = ref(false)
  const drivers = ref([])
  const { showToast } = useCustomToast()

  const fetchDrivers = async () => {
    loading.value = true
    try {
      const res = (await drivers_api.$_get_drivers()) as any
      if (res.type !== "ERROR") {
        drivers.value = res.data.data
        return res.data.data
      } else {
        showToast({
          title: "Error",
          message: res?.data?.error || "Failed to fetch drivers",
          toastType: "error",
          duration: 3000,
        })
        return []
      }
    } catch (error: any) {
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
    fetchDrivers()
  })

  return {
    loading,
    drivers,
    fetchDrivers,
  }
}
