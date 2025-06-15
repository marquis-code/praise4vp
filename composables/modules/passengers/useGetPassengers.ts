import { ref, watch, onMounted, readonly } from "vue"
import { passengers_api } from "@/api_factory/modules/passengers"
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
  status?: "active" | "inactive"
  authProvider?: string
  verificationStatus?: string
  emailVerified?: string
}

export const useGetPassengers = () => {
  const loading = ref(false)
  const passengers = ref([])
  const { showToast } = useCustomToast()

  const pagination = ref<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  })

  const filters = ref<FilterParams>({
    search: "",
    startDate: "",
    endDate: "",
    status: undefined,
    authProvider: "",
    verificationStatus: "",
    emailVerified: "",
  })

  const fetchPassengers = async (page = 1, limit = 10, filterParams?: FilterParams) => {
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

      const res = (await passengers_api.$_get_passengers(cleanParams)) as any

      if (res.type !== "ERROR") {
        passengers.value = res?.data?.data || []
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
          message: res?.data?.error || "Failed to fetch passengers",
          toastType: "error",
          duration: 3000,
        })
        passengers.value = []
        return []
      }
    } catch (error: any) {
      showToast({
        title: "Error",
        message: error?.message || "Something went wrong",
        toastType: "error",
        duration: 3000,
      })
      passengers.value = []
      return []
    } finally {
      loading.value = false
    }
  }

  const changePage = async (page: number) => {
    pagination.value.page = page
    await fetchPassengers(page, pagination.value.limit, filters.value)
  }

  const changeLimit = async (limit: number) => {
    pagination.value.page = 1 // Reset to first page when changing limit
    pagination.value.limit = limit
    await fetchPassengers(1, limit, filters.value)
  }

  // Watch for filter changes and automatically refetch data
  watch(
    filters,
    async (newFilters, oldFilters) => {
      // Check if any filter actually changed
      const hasChanged = Object.keys(newFilters).some(
        (key) => newFilters[key as keyof FilterParams] !== oldFilters?.[key as keyof FilterParams],
      )

      if (hasChanged) {
        // Reset to first page when filters change
        pagination.value.page = 1
        await fetchPassengers(1, pagination.value.limit, newFilters)
      }
    },
    {
      deep: true, // Watch nested properties
      flush: "post", // Execute after component updates
    },
  )

  // Watch for pagination changes (separate from filters)
  watch(
    () => [pagination.value.page, pagination.value.limit],
    async ([newPage, newLimit], [oldPage, oldLimit]) => {
      // Only refetch if page or limit changed, not on initial load
      if (oldPage !== undefined && oldLimit !== undefined) {
        if (newPage !== oldPage || newLimit !== oldLimit) {
          await fetchPassengers(newPage, newLimit, filters.value)
        }
      }
    },
  )

  // Method to update a single filter
  const updateFilter = (key: keyof FilterParams, value: any) => {
    filters.value[key] = value
  }

  // Method to update multiple filters at once
  const updateFilters = (newFilters: Partial<FilterParams>) => {
    Object.assign(filters.value, newFilters)
  }

  // Method to clear all filters
  const clearFilters = () => {
    filters.value = {
      search: "",
      startDate: "",
      endDate: "",
      status: undefined,
      authProvider: "",
      verificationStatus: "",
      emailVerified: "",
    }
  }

  onMounted(() => {
    fetchPassengers()
  })

  return {
    loading,
    passengers,
    pagination: readonly(pagination),
    filters,
    fetchPassengers,
    changePage,
    changeLimit,
    updateFilter,
    updateFilters,
    clearFilters,
  }
}
