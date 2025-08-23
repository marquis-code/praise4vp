import { ref, readonly, onMounted, watch } from "vue"
import { transactions_api } from "@/api_factory/modules/transactions"
import { useCustomToast } from "@/composables/core/useCustomToast"

interface PaginationData {
  page: number
  limit: number
  total: number
  totalPages: number
}

export const useGetTransactions = () => {
  const loading = ref(false)
  const transactions = ref([])
  const pagination = ref<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  })
  
  
  const { showToast } = useCustomToast()

  const fetchTransactions = async (page = 1, limit = 10) => {
    loading.value = true
    try {
      const params = {
        page,
        limit
      }
    
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, value]) => 
          value !== undefined && value !== null && value !== ''
        )
      )

      const res = await transactions_api.$_get_transactions(cleanParams)
      console.log(res?.data?.transactions, 'res here')
      
      if (res.status === 200 || res.status === 201) {
        transactions.value = res?.data?.transactions || []
        pagination.value = {
          page: res?.data?.page || 1,
          limit: res?.data?.limit || 10,
          total: res?.data?.total || 0,
          totalPages: res?.data?.totalPages || 1,
        }
        return res?.data?.transactions || []
      } else {
        showToast({
          title: "Error",
          message: res?.data?.error || "Failed to fetch transactions",
          toastType: "error",
          duration: 3000,
        })
        transactions.value = []
        return []
      }
    } catch (error) {
      showToast({
        title: "Error",
        message: error?.message || "Something went wrong",
        toastType: "error",
        duration: 3000,
      })
      transactions.value = []
      return []
    } finally {
      loading.value = false
    }
  }

  const changePage = async (page: number) => {
    pagination.value.page = page
    await fetchTransactions(page, pagination.value.limit)
  }

  const changeLimit = async (limit: number) => {
    pagination.value.page = 1 // Reset to first page when changing limit
    pagination.value.limit = limit
    await fetchTransactions(1, limit, filters.value)
  }

  // Method to refresh data with current filters
  const refreshTransactions = async () => {
    await fetchTransactions(pagination.value.page, pagination.value.limit)
  }


  // Watch for pagination changes (separate from filters)
  watch(
    () => [pagination.value.page, pagination.value.limit],
    async ([newPage, newLimit], [oldPage, oldLimit]) => {
      // Only refetch if page or limit changed, not on initial load
      if (oldPage !== undefined && oldLimit !== undefined) {
        if (newPage !== oldPage || newLimit !== oldLimit) {
          await fetchTransactions(newPage, newLimit)
        }
      }
    }
  )

  onMounted(() => {
    fetchTransactions()
  })

  return {
    loading,
    transactions,
    pagination: readonly(pagination),
    fetchTransactions,
    changePage,
    changeLimit,
    refreshTransactions
  }
}