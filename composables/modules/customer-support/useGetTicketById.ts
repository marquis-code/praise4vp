import { ref, onMounted } from "vue"
import { useRoute } from "vue-router"
import { customer_support_api } from "@/api_factory/modules/customer_support"
import { useCustomToast } from "@/composables/core/useCustomToast"

export const useGetTicketById = () => {
  const loading = ref(false)
  const ticket = ref(null)
  const { showToast } = useCustomToast()
  const route = useRoute()

  const fetchTicketById = async (id?: string) => {
    const ticketId = id || route.params.id as string
    loading.value = true
    try {
      const res = (await customer_support_api.$_get_ticket_by_id(ticketId)) as any
      if (res.type !== "ERROR") {
        ticket.value = res.data
        return res.data
      } else {
        showToast({
          title: "Error",
          message: res?.data?.error || "Failed to fetch ticket details",
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
    if (route.params.id) {
      fetchTicketById()
    }
  })

  return {
    loading,
    ticket,
    fetchTicketById
  }
}