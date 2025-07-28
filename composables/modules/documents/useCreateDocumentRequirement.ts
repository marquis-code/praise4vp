import { ref } from "vue"
import { country_documents_api } from "@/api_factory/modules/documents"
import { useCustomToast } from "@/composables/core/useCustomToast"

export const useCreateDocumentRequirement = () => {
  const loading = ref(false)
  const { showToast } = useCustomToast()

  const createDocumentRequirement = async (payload: {
    countryCode: string
    documentCode: string
    name: string
    required: boolean
  }) => {
    loading.value = true
    try {
      const res = (await country_documents_api.$_create_document_requirement(payload)) as any
      if (res.type !== "ERROR") {
        showToast({
          title: "Success",
          message: "Document requirement created successfully",
          toastType: "success",
          duration: 3000,
        })
        return res.data
      } else {
        showToast({
          title: "Error",
          message: res?.data?.error || "Failed to create document requirement",
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
    createDocumentRequirement
  }
}