import { ref } from "vue"
import { trips_api } from "@/api_factory/modules/trips"
import { useCustomToast } from "@/composables/core/useCustomToast"

interface PaginationData {
  page: number
  limit: number
  total: number
  totalPages: number
}

export const useGetTripOffers = () => {
  const loading = ref(false)
  const tripOffersList = ref(null)
  const { showToast } = useCustomToast()
  const route = useRoute()
  const pagination = ref<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  })

  const fetchTripOffers = async (page = 1, limit = 10) => {
    loading.value = true
    try {
            // Build the parameters object for the API call
            const params = {
              page,
              limit
            }
            
            // Remove empty/undefined values to keep the API call clean
            const cleanParams = Object.fromEntries(
              Object.entries(params).filter(([_, value]) => 
                value !== undefined && value !== null && value !== ''
              )
            )

      const res = (await trips_api.$_trip_offers(cleanParams)) as any
      if (res.type !== "ERROR") {
        tripOffersList.value = res?.data?.data
        pagination.value = {
          page: res?.data?.meta?.page || 1,
          limit: res?.data?.meta?.limit || 10,
          total: res?.data?.meta?.total || 0,
          totalPages: res?.data?.meta?.totalPages || 1,
        }
        return res?.data?.data
      } else {
        showToast({
          title: "Error",
          message: res?.data?.error || "Failed to fetch trip offers",
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
      tripOffersList.value = []
    } finally {
      loading.value = false
    }
  }

  const changeLimit = async (limit: number) => {
    pagination.value.page = 1 // Reset to first page when changing limit
    pagination.value.limit = limit
    await fetchTripOffers(1, limit)
  }

  const changePage = async (page: number) => {
    pagination.value.page = page
    await fetchTripOffers(page, pagination.value.limit)
  }

    // Watch for pagination changes (separate from filters)
    watch(
      () => [pagination.value.page, pagination.value.limit],
      async ([newPage, newLimit], [oldPage, oldLimit]) => {
        // Only refetch if page or limit changed, not on initial load
        if (oldPage !== undefined && oldLimit !== undefined) {
          if (newPage !== oldPage || newLimit !== oldLimit) {
            await fetchTripOffers(newPage, newLimit)
          }
        }
      }
    )
  

  onMounted(() => {
    fetchTripOffers()
  })

  return {
    loading,
    tripOffersList,
    fetchTripOffers,
    pagination: readonly(pagination),
    // filters,
    changePage,
    changeLimit
  }
}
