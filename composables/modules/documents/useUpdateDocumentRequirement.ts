import { ref } from "vue"
import { country_documents_api } from "@/api_factory/modules/documents"
import { useCustomToast } from "@/composables/core/useCustomToast"

export const useUpdateDocumentRequirement = () => {
  const loading = ref(false)
  const { showToast } = useCustomToast()

  const updateDocumentRequirement = async (
    id: string, 
    payload: Partial<{
      countryCode: string
      documentCode: string
      name: string
      required: boolean
    }>
  ) => {
    loading.value = true
    try {
      const res = (await country_documents_api.$_update_document_requirement(id, payload)) as any
      if (res.type !== "ERROR") {
        showToast({
          title: "Success",
          message: "Document requirement updated successfully",
          toastType: "success",
          duration: 3000,
        })
        return res.data
      } else {
        showToast({
          title: "Error",
          message: res?.data?.error || "Failed to update document requirement",
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
    updateDocumentRequirement
  }
}