import { ref } from "vue"
import { auth_api, type LoginInterface } from "@/api_factory/modules/auth"
import { useCustomToast } from "@/composables/core/useCustomToast"
import { useUser } from "@/composables/auth/user"

export const useAdminLogin = () => {
  const loading = ref(false)
  const { showToast } = useCustomToast()
  const { createUser } = useUser()
  const router = useRouter()

  const loginAdmin = async (credential: LoginInterface) => {
    loading.value = true
    try {
      const res = (await auth_api.$_admin_login(credential)) as any
      if (res.type !== "ERROR") {
        showToast({
          title: "Success",
          message: "Login successful",
          toastType: "success",
          duration: 3000,
        })
        console.log(res.data, 'here 0000000')
        createUser(res.data)
        router.push('/dashboard')
        window.location.href = "/dashboard"
        return res.data
      } else {
        showToast({
          title: "Error",
          message: res?.data?.error || "Invalid credentials",
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
    loginAdmin,
  }
}
