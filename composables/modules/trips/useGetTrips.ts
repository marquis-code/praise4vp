// import { ref, onMounted, readonly, watch } from "vue"
// import { trips_api } from "@/api_factory/modules/trips"
// import { useCustomToast } from "@/composables/core/useCustomToast"

// interface PaginationData {
//   page: number
//   limit: number
//   total: number
//   totalPages: number
// }

// interface FilterParams {
//   search?: string
//   status?: string
//   type?: string
//   isPrivate?: boolean
//   isScheduled?: boolean
//   startDate?: string
//   endDate?: string
// }

// export const useGetTrips = () => {
//   const loading = ref(false)
//   const trips = ref([])
//   const { showToast } = useCustomToast()

//   const pagination = ref<PaginationData>({
//     page: 1,
//     limit: 10,
//     total: 0,
//     totalPages: 1,
//   })

//   const filters = ref<FilterParams>({
//     search: "",
//     status: "",
//     type: "",
//     isPrivate: undefined,
//     isScheduled: undefined,
//     startDate: "",
//     endDate: "",
//   })

//   const fetchTrips = async (page = 1, limit = 10, filterParams?: FilterParams) => {
//     loading.value = true
//     try {
//       // Merge current filters with any passed filter params
//       const currentFilters = filterParams || filters.value

//       // Build the parameters object for the API call
//       const params = {
//         page,
//         limit,
//         ...currentFilters,
//       }

//       // Remove empty/undefined values to keep the API call clean
//       const cleanParams = Object.fromEntries(
//         Object.entries(params).filter(([_, value]) => value !== undefined && value !== null && value !== ""),
//       )

//       const res = (await trips_api.$_fetch_trips(cleanParams)) as any
//       console.log(res?.data?.meta, "trips res here")

//       if (res.type !== "ERROR") {
//         trips.value = res.data.data || []
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
//           message: res?.data?.error || "Failed to fetch trips",
//           toastType: "error",
//           duration: 3000,
//         })
//         trips.value = []
//         return []
//       }
//     } catch (error: any) {
//       showToast({
//         title: "Error",
//         message: error?.message || "Something went wrong",
//         toastType: "error",
//         duration: 3000,
//       })
//       trips.value = []
//       return []
//     } finally {
//       loading.value = false
//     }
//   }

//   const changePage = async (page: number) => {
//     pagination.value.page = page
//     await fetchTrips(page, pagination.value.limit, filters.value)
//   }

//   const changeLimit = async (limit: number) => {
//     pagination.value.page = 1 // Reset to first page when changing limit
//     pagination.value.limit = limit
//     await fetchTrips(1, limit, filters.value)
//   }

//   // Watch for filter changes and automatically refetch data
//   watch(
//     filters,
//     async (newFilters, oldFilters) => {
//       // Check if any filter actually changed
//       const hasChanged = Object.keys(newFilters).some(
//         (key) => newFilters[key as keyof FilterParams] !== oldFilters?.[key as keyof FilterParams],
//       )

//       if (hasChanged) {
//         // Reset to first page when filters change
//         pagination.value.page = 1
//         await fetchTrips(1, pagination.value.limit, newFilters)
//       }
//     },
//     {
//       deep: true, // Watch nested properties
//       flush: "post", // Execute after component updates
//     },
//   )

//   // Watch for pagination changes (separate from filters)
//   watch(
//     () => [pagination.value.page, pagination.value.limit],
//     async ([newPage, newLimit], [oldPage, oldLimit]) => {
//       // Only refetch if page or limit changed, not on initial load
//       if (oldPage !== undefined && oldLimit !== undefined) {
//         if (newPage !== oldPage || newLimit !== oldLimit) {
//           await fetchTrips(newPage, newLimit, filters.value)
//         }
//       }
//     },
//   )

//   // Method to update a single filter
//   const updateFilter = (key: keyof FilterParams, value: any) => {
//     filters.value[key] = value
//   }

//   // Method to update multiple filters at once
//   const updateFilters = (newFilters: Partial<FilterParams>) => {
//     Object.assign(filters.value, newFilters)
//   }

//   // Method to clear all filters
//   const clearFilters = () => {
//     filters.value = {
//       search: "",
//       status: "",
//       type: "",
//       isPrivate: undefined,
//       isScheduled: undefined,
//       startDate: "",
//       endDate: "",
//     }
//   }

//   onMounted(() => {
//     fetchTrips()
//   })

//   return {
//     loading,
//     trips,
//     pagination: readonly(pagination),
//     filters,
//     fetchTrips,
//     changePage,
//     changeLimit,
//     updateFilter,
//     updateFilters,
//     clearFilters,
//   }
// }


import { ref, onMounted, readonly, watch } from "vue"
import { trips_api } from "@/api_factory/modules/trips"
import { useCustomToast } from "@/composables/core/useCustomToast"
import type { Trip, TripFilters, PaginationData } from "@/types/trip"

export const useGetTrips = () => {
  const loading = ref(false)
  const trips = ref<Trip[]>([])
  const { showToast } = useCustomToast()

  const pagination = ref<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  })

  const filters = ref<TripFilters>({
    search: "",
    status: "",
    type: "",
    isPrivate: undefined,
    isScheduled: undefined,
    startDate: "",
    endDate: "",
  })

  const fetchTrips = async (page = 1, limit = 10, filterParams?: TripFilters) => {
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

      const res = (await trips_api.$_fetch_trips(cleanParams)) as any

      if (res.type !== "ERROR") {
        trips.value = res.data.data || []
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
          message: res?.data?.error || "Failed to fetch trips",
          toastType: "error",
          duration: 3000,
        })
        trips.value = []
        return []
      }
    } catch (error: any) {
      showToast({
        title: "Error",
        message: error?.message || "Something went wrong",
        toastType: "error",
        duration: 3000,
      })
      trips.value = []
      return []
    } finally {
      loading.value = false
    }
  }

  const changePage = async (page: number) => {
    pagination.value.page = page
    await fetchTrips(page, pagination.value.limit, filters.value)
  }

  const changeLimit = async (limit: number) => {
    pagination.value.page = 1
    pagination.value.limit = limit
    await fetchTrips(1, limit, filters.value)
  }

  // Watch for filter changes and automatically refetch data
  watch(
    filters,
    async (newFilters, oldFilters) => {
      const hasChanged = Object.keys(newFilters).some(
        (key) => newFilters[key as keyof TripFilters] !== oldFilters?.[key as keyof TripFilters],
      )

      if (hasChanged) {
        pagination.value.page = 1
        await fetchTrips(1, pagination.value.limit, newFilters)
      }
    },
    {
      deep: true,
      flush: "post",
    },
  )

  // Method to update a single filter
  const updateFilter = (key: keyof TripFilters, value: any) => {
    filters.value[key] = value
  }

  // Method to update multiple filters at once
  const updateFilters = (newFilters: Partial<TripFilters>) => {
    Object.assign(filters.value, newFilters)
  }

  // Method to clear all filters
  const clearFilters = () => {
    filters.value = {
      search: "",
      status: "",
      type: "",
      isPrivate: undefined,
      isScheduled: undefined,
      startDate: "",
      endDate: "",
    }
  }

  onMounted(() => {
    fetchTrips()
  })

  return {
    loading,
    trips,
    pagination: readonly(pagination),
    filters,
    fetchTrips,
    changePage,
    changeLimit,
    updateFilter,
    updateFilters,
    clearFilters,
  }
}
