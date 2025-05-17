import { ref } from "vue"
import { auth_api, type CreateAdminInterface } from "@/api_factory/modules/auth"
import { useCustomToast } from "@/composables/core/useCustomToast"

export const useCreateAdmin = () => {
  const loading = ref(false)
  const { showToast } = useCustomToast()

  const createAdmin = async (credential: CreateAdminInterface) => {
    loading.value = true
    try {
      const res = (await auth_api.$_create_admin(credential)) as any
      if (res.type !== "ERROR") {
        showToast({
          title: "Success",
          message: res.data.message || "Admin created successfully",
          toastType: "success",
          duration: 3000,
        })
        return res.data
      } else {
        showToast({
          title: "Error",
          message: res?.data?.error || "Something went wrong",
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
    createAdmin,
  }
}
