import { ref } from "vue"
import { deliveries_api } from "@/api_factory/modules/deliveries"
import { useCustomToast } from "@/composables/core/useCustomToast"

interface PaginationData {
  page: number
  limit: number
  total: number
  totalPages: number
}

export const useGetDriversDeliveries = () => {
  const loading = ref(false)
  const deliveries = ref([])
  const route = useRoute()
  const pagination = ref<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  })
  const { showToast } = useCustomToast()

  const fetchDriverDeliveries = async (page = 1, limit = 10) => {
    loading.value = true
    try {
      const res = (await deliveries_api.$_fetch_drivers_deliveries(route.params.id, page, limit)) as any
      console.log(res, 'deliveres res hee')
      if (res.type !== "ERROR") {
        deliveries.value = res?.data?.deliveries
        pagination.value = {
          page: res?.data?.page || 1,
          limit: res?.data?.limit || 10,
          total: res?.data?.total || 0,
          totalPages: res?.data?.totalPages || 1,
        }
        return res.data.deliveries || []
      } else {
        showToast({
          title: "Error",
          message: res?.data?.error || "Failed to fetch deliveries",
          toastType: "error",
          duration: 3000,
        })
        deliveries.value = []
        return []
      }
    } catch (error: any) {
      showToast({
        title: "Error",
        message: error?.message || "Something went wrong",
        toastType: "error",
        duration: 3000,
      })
      deliveries.value = []
      return []
    } finally {
      loading.value = false
    }
  }

  const changePage = async (page: number) => {
    await fetchDriverDeliveries(page, pagination.value.limit)
  }

  const changeLimit = async (limit: number) => {
    await fetchDriverDeliveries(1, limit)
  }

  onMounted(() => {
    fetchDriverDeliveries()
  })

  return {
    loading,
    deliveries,
    pagination: readonly(pagination),
    fetchDriverDeliveries,
    changePage,
    changeLimit,
  }
}
