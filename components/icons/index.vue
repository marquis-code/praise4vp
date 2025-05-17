<template>
  <component :is="icon" v-bind="$attrs" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { 
  Search, 
  User, 
  UserCheck,
  Users,
  MapPin, 
  Flag, 
  Clock, 
  MoreVertical,
  Eye,
  Edit,
  XCircle,
  Calendar,
  FileText,
  Car,
  CheckCircle,
  Inbox,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Download,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  AlertTriangle,
  Share2,
  Map,
  Maximize2,
  PhoneCall,
  Plus,
  ChevronLeft,
  ChevronRight,
  Bell,
  MessageSquare,
  Star
} from 'lucide-vue-next'

const props = defineProps<{
  name: string
}>()

const icon = computed(() => {
  const icons = {
    Search,
    User,
    UserCheck,
    Users,
    MapPin,
    Flag,
    Clock,
    MoreVertical,
    Eye,
    Edit,
    XCircle,
    Calendar,
    FileText,
    Car,
    CheckCircle,
    Inbox,
    ChevronUp,
    ChevronDown,
    ChevronsUpDown,
    Download,
    ArrowLeft,
    ArrowRight,
    AlertCircle,
    AlertTriangle,
    Share2,
    Map,
    Maximize2,
    PhoneCall,
    Plus,
    ChevronLeft,
    ChevronRight,
    Bell,
    MessageSquare,
    Star
  }
  
  return icons[props.name] || null
})
</script>