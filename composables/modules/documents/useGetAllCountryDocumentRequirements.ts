import { ref } from "vue"
import { country_documents_api } from "@/api_factory/modules/documents"
import { useCustomToast } from "@/composables/core/useCustomToast"

export const useGetAllCountryDocumentRequirements = () => {
  const loading = ref(false)
  const documentRequirements = ref([])
  const totalCount = ref(0)
  const { showToast } = useCustomToast()

  const fetchAllDocumentRequirements = async (params?: { 
    page?: number
    limit?: number
    countryCode?: string
    documentCode?: string
  }) => {
    loading.value = true
    try {
      const res = (await country_documents_api.$_get_all_country_document_requirements(params)) as any
      if (res.type !== "ERROR") {
        documentRequirements.value = res.data?.data || res.data || []
        totalCount.value = res.data?.totalCount || res.data?.total || 0
        return res.data
      } else {
        showToast({
          title: "Error",
          message: res?.data?.error || "Failed to fetch document requirements",
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
    fetchAllDocumentRequirements()
  })

  return {
    loading,
    documentRequirements,
    totalCount,
    fetchAllDocumentRequirements
  }
}