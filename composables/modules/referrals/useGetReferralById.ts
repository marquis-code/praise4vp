// src/composables/referrals/useGetReferralById.ts
import { ref, watch, onMounted } from "vue"
import { referral_api } from "@/api_factory/modules/referrals"
import { useCustomToast } from "@/composables/core/useCustomToast"

export const useGetReferralById = (initialId?: string) => {
  const loading = ref(false)
  const referral = ref<any | null>(null)
  const id = ref<string | undefined>(initialId)

  const { showToast } = useCustomToast()

  const fetchReferral = async (referralId = id.value) => {
    if (!referralId) return null
    loading.value = true
    try {
      const res = await referral_api.$_get_referral_by_id(referralId)
      referral.value =
        res?.data?.referral ?? res?.data?.result ?? res?.data?.data ?? res?.data ?? null
      return referral.value
    } catch (error: any) {
      showToast({
        title: "Error",
        message: error?.message || "Failed to fetch referral",
        toastType: "error",
        duration: 3000,
      })
      referral.value = null
      return null
    } finally {
      loading.value = false
    }
  }

  const setId = async (newId: string) => {
    id.value = newId
    await fetchReferral(newId)
  }

  onMounted(() => {
    if (id.value) fetchReferral(id.value)
  })

  watch(id, async (newId, oldId) => {
    if (newId && newId !== oldId) {
      await fetchReferral(newId)
    }
  })

  return {
    loading,
    referral,
    id,
    setId,
    fetchReferral,
  }
}
