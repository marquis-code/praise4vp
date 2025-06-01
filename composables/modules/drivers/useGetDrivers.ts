// import { ref } from "vue"
// import { drivers_api } from "@/api_factory/modules/drivers"
// import { useCustomToast } from "@/composables/core/useCustomToast"

// interface PaginationData {
//   page: number
//   limit: number
//   total: number
//   totalPages: number
// }

// export const useGetDrivers = () => {
//   const loading = ref(false)
//   const drivers = ref([])
//   const pagination = ref<PaginationData>({
//     page: 1,
//     limit: 10,
//     total: 0,
//     totalPages: 1,
//   })
//   const { showToast } = useCustomToast()

//   const fetchDrivers = async (page = 1, limit = 10) => {
//     loading.value = true
//     try {
//       const res = (await drivers_api.$_get_drivers(page, limit)) as any
//       if (res.type !== "ERROR") {
//         drivers.value = res.data.data || []
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
//           message: res?.data?.error || "Failed to fetch drivers",
//           toastType: "error",
//           duration: 3000,
//         })
//         drivers.value = []
//         return []
//       }
//     } catch (error: any) {
//       showToast({
//         title: "Error",
//         message: error?.message || "Something went wrong",
//         toastType: "error",
//         duration: 3000,
//       })
//       drivers.value = []
//       return []
//     } finally {
//       loading.value = false
//     }
//   }

//   const changePage = async (page: number) => {
//     await fetchDrivers(page, pagination.value.limit)
//   }

//   const changeLimit = async (limit: number) => {
//     await fetchDrivers(1, limit)
//   }

//   onMounted(() => {
//     fetchDrivers()
//   })

//   return {
//     loading,
//     drivers,
//     pagination: readonly(pagination),
//     fetchDrivers,
//     changePage,
//     changeLimit
//   }
// }


// import { ref, readonly, onMounted } from "vue"
// import { drivers_api } from "@/api_factory/modules/drivers"
// import { useCustomToast } from "@/composables/core/useCustomToast"

// interface PaginationData {
//   page: number
//   limit: number
//   total: number
//   totalPages: number
// }

// interface FilterParams {
//   search?: string
//   startDate?: string
//   endDate?: string
//   status?: 'active' | 'inactive'
//   countryCode?: string
// }

// export const useGetDrivers = () => {
//   const loading = ref(false)
//   const drivers = ref([])
//   const pagination = ref<PaginationData>({
//     page: 1,
//     limit: 10,
//     total: 0,
//     totalPages: 1,
//   })
  
//   // Add filters state
//   const filters = ref<FilterParams>({
//     search: '',
//     startDate: '',
//     endDate: '',
//     status: undefined,
//     countryCode: ''
//   })
  
//   const { showToast } = useCustomToast()

//   const fetchDrivers = async (page = 1, limit = 10, filterParams?: FilterParams) => {
//     loading.value = true
//     try {
//       // Merge current filters with any passed filter params
//       const currentFilters = filterParams || filters.value
      
//       // Build the parameters object for the API call
//       const params = {
//         page,
//         limit,
//         ...currentFilters
//       }
      
//       // Remove empty/undefined values to keep the API call clean
//       const cleanParams = Object.fromEntries(
//         Object.entries(params).filter(([_, value]) => 
//           value !== undefined && value !== null && value !== ''
//         )
//       )

//       const res = (await drivers_api.$_get_drivers(cleanParams)) as any
      
//       if (res.type !== "ERROR") {
//         drivers.value = res.data.data || []
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
//           message: res?.data?.error || "Failed to fetch drivers",
//           toastType: "error",
//           duration: 3000,
//         })
//         drivers.value = []
//         return []
//       }
//     } catch (error: any) {
//       showToast({
//         title: "Error",
//         message: error?.message || "Something went wrong",
//         toastType: "error",
//         duration: 3000,
//       })
//       drivers.value = []
//       return []
//     } finally {
//       loading.value = false
//     }
//   }

//   const changePage = async (page: number) => {
//     await fetchDrivers(page, pagination.value.limit, filters.value)
//   }

//   const changeLimit = async (limit: number) => {
//     pagination.value.page = 1 // Reset to first page when changing limit
//     await fetchDrivers(1, limit, filters.value)
//   }

//   // New method to apply filters
//   const applyFilters = async (newFilters: Partial<FilterParams>) => {
//     filters.value = { ...filters.value, ...newFilters }
//     pagination.value.page = 1 // Reset to first page when applying filters
//     await fetchDrivers(1, pagination.value.limit, filters.value)
//   }

//   // Method to clear all filters
//   const clearFilters = async () => {
//     filters.value = {
//       search: '',
//       startDate: '',
//       endDate: '',
//       status: undefined,
//       countryCode: ''
//     }
//     pagination.value.page = 1
//     await fetchDrivers(1, pagination.value.limit)
//   }

//   // Method to search drivers
//   const searchDrivers = async (searchTerm: string) => {
//     await applyFilters({ search: searchTerm })
//   }

//   // Method to filter by status
//   const filterByStatus = async (status: 'active' | 'inactive' | undefined) => {
//     await applyFilters({ status })
//   }

//   // Method to filter by date range
//   const filterByDateRange = async (startDate: string, endDate: string) => {
//     await applyFilters({ startDate, endDate })
//   }

//   // Method to filter by country
//   const filterByCountry = async (countryCode: string) => {
//     await applyFilters({ countryCode })
//   }

//   // Method to refresh data with current filters
//   const refreshDrivers = async () => {
//     await fetchDrivers(pagination.value.page, pagination.value.limit, filters.value)
//   }

//   onMounted(() => {
//     fetchDrivers()
//   })

//   return {
//     loading,
//     drivers,
//     pagination: readonly(pagination),
//     filters: readonly(filters),
//     fetchDrivers,
//     changePage,
//     changeLimit,
//     applyFilters,
//     clearFilters,
//     searchDrivers,
//     filterByStatus,
//     filterByDateRange,
//     filterByCountry,
//     refreshDrivers
//   }
// }


import { ref, readonly, onMounted, watch } from "vue"
import { drivers_api } from "@/api_factory/modules/drivers"
import { useCustomToast } from "@/composables/core/useCustomToast"

interface PaginationData {
  page: number
  limit: number
  total: number
  totalPages: number
}

interface FilterParams {
  search?: string
  startDate?: string
  endDate?: string
  status?: 'active' | 'inactive'
  countryCode?: string
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
  
  // Make filters reactive and writable for external components
  const filters = ref<FilterParams>({
    search: '',
    startDate: '',
    endDate: '',
    status: undefined,
    countryCode: ''
  })
  
  const { showToast } = useCustomToast()

  const fetchDrivers = async (page = 1, limit = 10, filterParams?: FilterParams) => {
    loading.value = true
    try {
      // Merge current filters with any passed filter params
      const currentFilters = filterParams || filters.value
      
      // Build the parameters object for the API call
      const params = {
        page,
        limit,
        ...currentFilters
      }
      
      // Remove empty/undefined values to keep the API call clean
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, value]) => 
          value !== undefined && value !== null && value !== ''
        )
      )

      const res = await drivers_api.$_get_drivers(cleanParams)
      
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
    } catch (error) {
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
    pagination.value.page = page
    await fetchDrivers(page, pagination.value.limit, filters.value)
  }

  const changeLimit = async (limit: number) => {
    pagination.value.page = 1 // Reset to first page when changing limit
    pagination.value.limit = limit
    await fetchDrivers(1, limit, filters.value)
  }

  // New method to apply filters (now updates the reactive filters)
  const applyFilters = async (newFilters: Partial<FilterParams>) => {
    // Update the reactive filters - this will trigger the watcher
    Object.assign(filters.value, newFilters)
  }

  // Method to clear all filters
  const clearFilters = async () => {
    // Reset filters - this will trigger the watcher
    filters.value.search = ''
    filters.value.startDate = ''
    filters.value.endDate = ''
    filters.value.status = undefined
    filters.value.countryCode = ''
  }

  // Method to search drivers
  const searchDrivers = async (searchTerm: string) => {
    filters.value.search = searchTerm
  }

  // Method to filter by status
  const filterByStatus = async (status: 'active' | 'inactive' | undefined) => {
    filters.value.status = status
  }

  // Method to filter by date range
  const filterByDateRange = async (startDate: string, endDate: string) => {
    filters.value.startDate = startDate
    filters.value.endDate = endDate
  }

  // Method to filter by country
  const filterByCountry = async (countryCode: string) => {
    filters.value.countryCode = countryCode
  }

  // Method to refresh data with current filters
  const refreshDrivers = async () => {
    await fetchDrivers(pagination.value.page, pagination.value.limit, filters.value)
  }

  // Method to update a single filter
  const updateFilter = (key: keyof FilterParams, value: any) => {
    filters.value[key] = value
  }

  // Method to update multiple filters at once
  const updateFilters = (newFilters: Partial<FilterParams>) => {
    Object.assign(filters.value, newFilters)
  }

  watch(() => filters.value.countryCode, () => {
    fetchDrivers()
  })

  // Watch for filter changes and automatically refetch data
  watch(
    filters,
    async (newFilters, oldFilters) => {
      // Check if any filter actually changed
      const hasChanged = Object.keys(newFilters).some(
        key => newFilters[key as keyof FilterParams] !== oldFilters?.[key as keyof FilterParams]
      )
      
      if (hasChanged) {
        // Reset to first page when filters change
        pagination.value.page = 1
        await fetchDrivers(1, pagination.value.limit, newFilters)
      }
    },
    { 
      deep: true, // Watch nested properties
      flush: 'post' // Execute after component updates
    }
  )

  // Watch for pagination changes (separate from filters)
  watch(
    () => [pagination.value.page, pagination.value.limit],
    async ([newPage, newLimit], [oldPage, oldLimit]) => {
      // Only refetch if page or limit changed, not on initial load
      if (oldPage !== undefined && oldLimit !== undefined) {
        if (newPage !== oldPage || newLimit !== oldLimit) {
          await fetchDrivers(newPage, newLimit, filters.value)
        }
      }
    }
  )

  onMounted(() => {
    fetchDrivers()
  })

  return {
    loading,
    drivers,
    pagination: readonly(pagination),
    filters, // Now writable for external components
    fetchDrivers,
    changePage,
    changeLimit,
    applyFilters,
    clearFilters,
    searchDrivers,
    filterByStatus,
    filterByDateRange,
    filterByCountry,
    refreshDrivers,
    updateFilter,
    updateFilters
  }
}