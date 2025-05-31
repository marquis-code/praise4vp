import { ref } from "vue"
import { customer_support_api } from "@/api_factory/modules/customer_support"
import { useCustomToast } from "@/composables/core/useCustomToast"

export const useUpdateTicket = () => {
  const loading = ref(false)
  const { showToast } = useCustomToast()

  const updateTicket = async (id: string, payload: any) => {
    loading.value = true
    try {
      const res = (await customer_support_api.$_update_ticket(id, payload)) as any
      if (res.type !== "ERROR") {
        showToast({
          title: "Success",
          message: "Ticket updated successfully",
          toastType: "success",
          duration: 3000,
        })
        return res.data
      } else {
        showToast({
          title: "Error",
          message: res?.data?.error || "Failed to update ticket",
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

  return {
    loading,
    updateTicket
  }
}
