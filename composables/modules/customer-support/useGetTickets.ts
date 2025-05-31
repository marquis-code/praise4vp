// useGetTickets.ts
import { ref } from "vue"
import { customer_support_api } from "@/api_factory/modules/customer_support"
import { useCustomToast } from "@/composables/core/useCustomToast"

export const useGetTickets = () => {
  const loading = ref(false)
  const tickets = ref(null)
  const { showToast } = useCustomToast()

  const fetchTickets = async (params?: { startDate: string, endDate: string }) => {
    loading.value = true
    try {
      const res = (await customer_support_api.$_get_tickets(params)) as any
      console.log(res, 'res here')
      if (res.type !== "ERROR") {
        tickets.value = res.data.data
        return res.data.data
      } else {
        showToast({
          title: "Error",
          message: res?.data?.error || "Failed to fetch tickets",
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
    fetchTickets()
  })

  return {
    loading,
    tickets,
    fetchTickets
  }
}
