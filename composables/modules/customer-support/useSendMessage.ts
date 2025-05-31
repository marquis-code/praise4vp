
// useSendMessage.ts
import { ref } from "vue"
import { customer_support_api } from "@/api_factory/modules/customer_support"
import { useCustomToast } from "@/composables/core/useCustomToast"

export const useSendMessage = () => {
  const loading = ref(false)
  const { showToast } = useCustomToast()

  const sendMessage = async (id, payload: any) => {
    loading.value = true
    try {
      const res = (await customer_support_api.$_send_message(id, payload)) as any
      if (res.type !== "ERROR") {
        showToast({
          title: "Success",
          message: "Message sent successfully",
          toastType: "success",
          duration: 3000,
        })
        return res.data
      } else {
        showToast({
          title: "Error",
          message: res?.data?.error || "Failed to send message",
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
    sendMessage
  }
}