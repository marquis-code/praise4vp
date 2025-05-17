import { ref } from "vue"
import { dashboard_api } from "@/api_factory/modules/dashboard"
import { useCustomToast } from "@/composables/core/useCustomToast"

export const useDashboardStats = () => {
  const loading = ref(false)
  const dashboardStats = ref(null)
  const { showToast } = useCustomToast()

  const fetchDashboardStats = async () => {
    loading.value = true
    try {
      const res = (await dashboard_api.$_dashboard_stats()) as any
      if (res.type !== "ERROR") {
        dashboardStats.value = res.data
        return res.data
      } else {
        showToast({
          title: "Error",
          message: res?.data?.error || "Failed to fetch dashboard statistics",
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
    fetchDashboardStats()
  })

  return {
    loading,
    dashboardStats,
    fetchDashboardStats,
  }
}
