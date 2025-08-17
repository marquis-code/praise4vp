// src/composables/referrals/useGetReferralStats.ts
import { ref, onMounted, watch } from "vue"
import { referral_api } from "@/api_factory/modules/referrals"
import { useCustomToast } from "@/composables/core/useCustomToast"

/**
 * Stats can be global or scoped by user & date range.
 * Dates should be ISO strings (e.g., "2025-01-01").
 */
export const useGetReferralStats = (initial: { userId?: string; from?: string; to?: string } = {}) => {
  const loading = ref(false)
  const stats = ref<any | null>(null)

  const userId = ref<string | undefined>(initial.userId)
  const from = ref<string | undefined>(initial.from)
  const to = ref<string | undefined>(initial.to)

  const { showToast } = useCustomToast()

  const fetchStats = async (opts: { userId?: string; from?: string; to?: string } = {}) => {
    loading.value = true
    try {
      const params = Object.fromEntries(
        Object.entries({
          userId: opts.userId ?? userId.value,
          from: opts.from ?? from.value,
          to: opts.to ?? to.value,
        }).filter(([, v]) => v !== undefined && v !== null && v !== "")
      )

      const res = await referral_api.$_get_referral_stats(params as any)
      stats.value = res?.data?.stats ?? res?.data?.result ?? res?.data?.data ?? res?.data ?? null
      return stats.value
    } catch (error: any) {
      showToast({
        title: "Error",
        message: error?.message || "Failed to fetch referral stats",
        toastType: "error",
        duration: 3000,
      })
      stats.value = null
      return null
    } finally {
      loading.value = false
    }
  }

  const setFilters = async (filters: { userId?: string; from?: string; to?: string }) => {
    if (filters.userId !== undefined) userId.value = filters.userId
    if (filters.from !== undefined) from.value = filters.from
    if (filters.to !== undefined) to.value = filters.to
    await fetchStats(filters)
  }

  onMounted(() => {
    fetchStats()
  })

  watch([userId, from, to], async () => {
    // Auto-refresh whenever any filter changes (optional – can be removed if you prefer manual)
    await fetchStats()
  })

  return {
    loading,
    stats,
    userId,
    from,
    to,
    fetchStats,
    setFilters,
  }
}
