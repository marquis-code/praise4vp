// useGetTicketMessages.ts
import { ref, onMounted } from "vue"
import { useRoute } from "vue-router"
import { customer_support_api } from "@/api_factory/modules/customer_support"
import { useCustomToast } from "@/composables/core/useCustomToast"

export const useGetTicketMessages = () => {
  const loading = ref(false)
  const messages = ref(null)
  const { showToast } = useCustomToast()
  const route = useRoute()

  const fetchTicketMessages = async (id?: string) => {
    const ticketId = id || route.params.id as string
    loading.value = true
    try {
      const res = (await customer_support_api.$_get_ticket_messages(ticketId)) as any
      console.log(res, 'ticjet messgesv')
      if (res.type !== "ERROR") {
        messages.value = res.data
        return res.data
      } else {
        showToast({
          title: "Error",
          message: res?.data?.error || "Failed to fetch ticket messages",
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
      fetchTicketMessages()
    }
  })

  return {
    loading,
    messages,
    fetchTicketMessages
  }
}
