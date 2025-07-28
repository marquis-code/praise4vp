import { ref } from "vue"
import { country_documents_api } from "@/api_factory/modules/documents"
import { useCustomToast } from "@/composables/core/useCustomToast"

export const useGetDocumentById = () => {
  const loading = ref(false)
  const documentRequirement = ref(null)
  const { showToast } = useCustomToast()
  const route = useRoute()

  const fetchDocumentById = async (id?: string) => {
    loading.value = true
    const documentId = id || route.params.id as any
    try {
      const res = (await country_documents_api.$_get_document_by_id(documentId)) as any
      if (res.type !== "ERROR") {
        documentRequirement.value = res.data
        return res.data
      } else {
        showToast({
          title: "Error",
          message: res?.data?.error || "Failed to fetch document requirement",
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
      fetchDocumentById()
    }
  })

  return {
    loading,
    documentRequirement,
    fetchDocumentById
  }
}