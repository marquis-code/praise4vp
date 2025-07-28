import { ref } from "vue"
import { country_documents_api } from "@/api_factory/modules/documents"
import { useCustomToast } from "@/composables/core/useCustomToast"

export const useDeleteDocumentRequirement = () => {
  const loading = ref(false)
  const { showToast } = useCustomToast()

  const deleteDocumentRequirement = async (id: string) => {
    loading.value = true
    try {
      const res = (await country_documents_api.$_delete_document_requirement(id)) as any
      if (res.type !== "ERROR") {
        showToast({
          title: "Success",
          message: "Document requirement deleted successfully",
          toastType: "success",
          duration: 3000,
        })
        return true
      } else {
        showToast({
          title: "Error",
          message: res?.data?.error || "Failed to delete document requirement",
          toastType: "error",
          duration: 3000,
        })
        return false
      }
    } catch (error: any) {
      showToast({
        title: "Error",
        message: error?.message || "Something went wrong",
        toastType: "error",
        duration: 3000,
      })
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    deleteDocumentRequirement
  }
}