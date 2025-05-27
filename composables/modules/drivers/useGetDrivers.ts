import { ref } from "vue"
import { drivers_api } from "@/api_factory/modules/drivers"
import { useCustomToast } from "@/composables/core/useCustomToast"

interface PaginationData {
  page: number
  limit: number
  total: number
  totalPages: number
}

export const useGetDrivers = () => {
  const loading = ref(false)
  const drivers = ref([])
  const pagination = ref<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  })
  const { showToast } = useCustomToast()

  const fetchDrivers = async (page = 1, limit = 10) => {
    loading.value = true
    try {
      const res = (await drivers_api.$_get_drivers(page, limit)) as any
      if (res.type !== "ERROR") {
        drivers.value = res.data.data || []
        pagination.value = {
          page: res?.data?.meta?.page || 1,
          limit: res?.data?.meta?.limit || 10,
          total: res?.data?.meta?.total || 0,
          totalPages: res?.data?.meta?.totalPages || 1,
        }
        return res.data.data || []
      } else {
        showToast({
          title: "Error",
          message: res?.data?.error || "Failed to fetch drivers",
          toastType: "error",
          duration: 3000,
        })
        drivers.value = []
        return []
      }
    } catch (error: any) {
      showToast({
        title: "Error",
        message: error?.message || "Something went wrong",
        toastType: "error",
        duration: 3000,
      })
      drivers.value = []
      return []
    } finally {
      loading.value = false
    }
  }

  const changePage = async (page: number) => {
    await fetchDrivers(page, pagination.value.limit)
  }

  const changeLimit = async (limit: number) => {
    await fetchDrivers(1, limit)
  }

  onMounted(() => {
    fetchDrivers()
  })

  return {
    loading,
    drivers,
    pagination: readonly(pagination),
    fetchDrivers,
    changePage,
    changeLimit
  }
}
