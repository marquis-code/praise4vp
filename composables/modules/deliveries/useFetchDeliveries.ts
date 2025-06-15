// import { ref } from "vue"
// import { deliveries_api } from "@/api_factory/modules/deliveries"
// import { useCustomToast } from "@/composables/core/useCustomToast"

// interface PaginationData {
//   page: number
//   limit: number
//   total: number
//   totalPages: number
// }

// export const useGetDeliveries = () => {
//   const loading = ref(false)
//   const deliveries = ref([])
//   const pagination = ref<PaginationData>({
//     page: 1,
//     limit: 10,
//     total: 0,
//     totalPages: 1,
//   })
//   const { showToast } = useCustomToast()

//   const fetchDeliveries = async (page = 1, limit = 10) => {
//     loading.value = true
//     try {
//       const res = (await deliveries_api.$_fetch_deliveries(page, limit)) as any
//       if (res.type !== "ERROR") {
//         deliveries.value = res?.data?.data
//         pagination.value = {
//           page: res?.data?.meta?.page || 1,
//           limit: res?.data?.meta?.limit || 10,
//           total: res?.data?.meta?.total || 0,
//           totalPages: res?.data?.meta?.totalPages || 1,
//         }
//         return res.data.data || []
//       } else {
//         showToast({
//           title: "Error",
//           message: res?.data?.error || "Failed to fetch deliveries",
//           toastType: "error",
//           duration: 3000,
//         })
//         deliveries.value = []
//         return []
//       }
//     } catch (error: any) {
//       showToast({
//         title: "Error",
//         message: error?.message || "Something went wrong",
//         toastType: "error",
//         duration: 3000,
//       })
//       deliveries.value = []
//       return []
//     } finally {
//       loading.value = false
//     }
//   }

//   const changePage = async (page: number) => {
//     await fetchDeliveries(page, pagination.value.limit)
//   }

//   const changeLimit = async (limit: number) => {
//     await fetchDeliveries(1, limit)
//   }

//   onMounted(() => {
//     fetchDeliveries()
//   })

//   return {
//     loading,
//     deliveries,
//     pagination: readonly(pagination),
//     fetchDeliveries,
//     changePage,
//     changeLimit,
//   }
// }


import { ref, onMounted, readonly, watch } from "vue"
import { deliveries_api } from "@/api_factory/modules/deliveries"
import { useCustomToast } from "@/composables/core/useCustomToast"
import type { Delivery, DeliveryFilters, PaginationData } from "~/types/delivery"

export const useGetDeliveries = () => {
  const loading = ref(false)
  const deliveries = ref<Delivery[]>([])
  const { showToast } = useCustomToast()

  const pagination = ref<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  })

  const filters = ref<DeliveryFilters>({
    search: "",
    status: "",
    type: "",
    vehicleType: "",
    driverId: "",
    startDate: "",
    endDate: "",
    minFare: undefined,
    maxFare: undefined,
    code: "",
    recipientPhone: "",
  })

  const fetchDeliveries = async (page = 1, limit = 10, filterParams?: DeliveryFilters) => {
    loading.value = true
    try {
      // Merge current filters with any passed filter params
      const currentFilters = filterParams || filters.value

      // Build the parameters object for the API call
      const params = {
        page,
        limit,
        ...currentFilters,
      }

      // Remove empty/undefined values to keep the API call clean
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value !== undefined && value !== null && value !== ""),
      )

      const res = (await deliveries_api.$_fetch_deliveries(cleanParams)) as any

      if (res.type !== "ERROR") {
        deliveries.value = res.data.data || []
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
    pagination.value.page = page
    await fetchDeliveries(page, pagination.value.limit, filters.value)
  }

  const changeLimit = async (limit: number) => {
    pagination.value.page = 1
    pagination.value.limit = limit
    await fetchDeliveries(1, limit, filters.value)
  }

  // Watch for filter changes and automatically refetch data
  watch(
    filters,
    async (newFilters, oldFilters) => {
      const hasChanged = Object.keys(newFilters).some(
        (key) => newFilters[key as keyof DeliveryFilters] !== oldFilters?.[key as keyof DeliveryFilters],
      )

      if (hasChanged) {
        pagination.value.page = 1
        await fetchDeliveries(1, pagination.value.limit, newFilters)
      }
    },
    {
      deep: true,
      flush: "post",
    },
  )

  // Method to update a single filter
  const updateFilter = (key: keyof DeliveryFilters, value: any) => {
    filters.value[key] = value
  }

  // Method to update multiple filters at once
  const updateFilters = (newFilters: Partial<DeliveryFilters>) => {
    Object.assign(filters.value, newFilters)
  }

  // Method to clear all filters
  const clearFilters = () => {
    filters.value = {
      search: "",
      status: "",
      type: "",
      vehicleType: "",
      driverId: "",
      startDate: "",
      endDate: "",
      minFare: undefined,
      maxFare: undefined,
      code: "",
      recipientPhone: "",
    }
  }

  onMounted(() => {
    fetchDeliveries()
  })

  return {
    loading,
    deliveries,
    pagination: readonly(pagination),
    filters,
    fetchDeliveries,
    changePage,
    changeLimit,
    updateFilter,
    updateFilters,
    clearFilters,
  }
}
