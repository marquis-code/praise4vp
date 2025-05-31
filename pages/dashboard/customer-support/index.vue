<template>
    <div class="min-h-screen bg-gray-50 flex flex-col">
      <!-- Main Content -->
      <div class="flex-1 w-full">
        <div class="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)]">
          <!-- Left Sidebar - Ticket List (Fixed) -->
          <div class="w-full lg:w-1/3 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col">
            <div class="p-6 border-b border-gray-200 bg-gradient-to-r from-[rgb(29,68,73)] to-[rgb(45,85,90)] flex-shrink-0">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-lg font-semibold text-white">Support Requests</h2>
                <div class="flex items-center space-x-2">
                  <div class="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1">
                    <span class="text-white text-sm font-medium">{{ totalTickets }}</span>
                  </div>
                </div>
              </div>
              
              <!-- Date Filter -->
              <div class="mb-4 space-y-3">
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs font-medium text-white/80 mb-1">Start Date</label>
                    <input 
                      v-model="startDate"
                      type="date" 
                      class="w-full px-3 py-2 text-xs border border-white/20 rounded-lg bg-white/10 text-white placeholder-white/60 focus:ring-2 focus:ring-white/30 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-white/80 mb-1">End Date</label>
                    <input 
                      v-model="endDate"
                      type="date" 
                      class="w-full px-3 py-2 text-xs border border-white/20 rounded-lg bg-white/10 text-white placeholder-white/60 focus:ring-2 focus:ring-white/30 focus:border-transparent"
                    />
                  </div>
                </div>
                <button 
                  @click="clearDateFilter"
                  v-if="startDate || endDate"
                  class="text-xs text-white/80 hover:text-white underline"
                >
                  Clear filters
                </button>
              </div>
              
              <!-- Tabs -->
              <div class="flex space-x-1 bg-white/10 rounded-lg p-1">
                <button 
                  @click="activeTab = 'open'"
                  :class="[
                    'flex-1 py-2 px-3 text-xs font-medium rounded-md transition-all duration-200',
                    activeTab === 'open' 
                      ? 'bg-white text-[rgb(29,68,73)] shadow-sm' 
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  ]"
                >
                  Open ({{ openTicketsCount }})
                </button>
                <button 
                  @click="activeTab = 'resolved'"
                  :class="[
                    'flex-1 py-2 px-3 text-xs font-medium rounded-md transition-all duration-200',
                    activeTab === 'resolved' 
                      ? 'bg-white text-[rgb(29,68,73)] shadow-sm' 
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  ]"
                >
                  Resolved ({{ resolvedTicketsCount }})
                </button>
                <button 
                  @click="activeTab = 'closed'"
                  :class="[
                    'flex-1 py-2 px-3 text-xs font-medium rounded-md transition-all duration-200',
                    activeTab === 'closed' 
                      ? 'bg-white text-[rgb(29,68,73)] shadow-sm' 
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  ]"
                >
                  Closed ({{ closedTicketsCount }})
                </button>
              </div>
            </div>
  
            <!-- Ticket List (Scrollable) -->
            <div class="flex-1 overflow-hidden">
              <!-- Loading State for Tickets -->
              <div v-if="fetchingTickets" class="p-6">
                <div class="space-y-4">
                  <div v-for="i in 3" :key="i" class="animate-pulse">
                    <div class="flex items-start space-x-3">
                      <div class="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div class="flex-1 space-y-2">
                        <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div class="h-3 bg-gray-200 rounded w-1/2"></div>
                        <div class="h-3 bg-gray-200 rounded w-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
  
              <!-- Tickets List -->
              <div v-else class="h-full overflow-y-auto">
                <div v-if="filteredTickets.length === 0" class="p-8 text-center">
                  <MessageSquare class="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p class="text-gray-500 text-sm">No {{ activeTab }} tickets found</p>
                </div>
                
                <div class="divide-y divide-gray-100">
                  <div 
                    v-for="ticket in filteredTickets" 
                    :key="ticket._id"
                    @click="selectTicket(ticket)"
                    :class="[
                      'p-4 cursor-pointer transition-all duration-200 hover:bg-gray-50 relative',
                      selectedTicketId === ticket._id ? 'bg-blue-50 border-l-4 border-l-[rgb(29,68,73)] shadow-sm' : ''
                    ]"
                  >
                    <div class="flex items-start space-x-3">
                      <div class="relative">
                        <div class="w-10 h-10 bg-gradient-to-br from-[rgb(29,68,73)] to-[rgb(45,85,90)] rounded-full flex items-center justify-center">
                          <span class="text-white text-sm font-semibold">
                            {{ ticket.userId?.firstName?.charAt(0) || 'U' }}{{ ticket.userId?.lastName?.charAt(0) || '' }}
                          </span>
                        </div>
                        <div :class="[
                          'absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white',
                          getStatusColor(ticket.status)
                        ]"></div>
                      </div>
                      
                      <div class="flex-1 min-w-0">
                        <div class="flex items-start justify-between mb-2">
                          <h3 class="text-sm font-semibold text-gray-900 truncate pr-2">{{ ticket.subject }}</h3>
                          <span 
                            :class="[
                              'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap',
                              getStatusBadgeColor(ticket.status)
                            ]"
                          >
                            {{ formatStatus(ticket.status) }}
                          </span>
                        </div>
                        
                        <p class="text-sm text-gray-600 mb-2 font-medium">{{ ticket.category }}</p>
                        <p class="text-xs text-gray-500 mb-3">{{ ticket.userId?.firstName }} {{ ticket.userId?.lastName }}</p>
                        
                        <div class="flex items-center justify-between">
                          <span class="text-xs text-gray-400">{{ formatDate(ticket.createdAt) }}</span>
                          <div class="flex items-center space-x-2">
                            <MessageSquare class="w-3 h-3 text-gray-400" />
                            <span class="text-xs text-gray-500">{{ getMessageCount(ticket._id) }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Right Side - Ticket Details (Scrollable) -->
          <div class="flex-1 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col">
            <!-- Loading State for Ticket Details -->
            <div v-if="loading && selectedTicketId" class="h-full flex items-center justify-center">
              <div class="text-center">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[rgb(29,68,73)] mx-auto mb-4"></div>
                <p class="text-gray-500">Loading ticket details...</p>
              </div>
            </div>
  
            <!-- Ticket Details -->
            <div v-else-if="selectedTicketDetails" class="h-full flex flex-col">
              <!-- Ticket Header (Fixed) -->
              <div class="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 flex-shrink-0">
                <div class="flex items-start justify-between mb-4">
                  <div class="flex-1">
                    <div class="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                      <span class="bg-gray-200 px-2 py-1 rounded-full text-xs">{{ selectedTicketDetails.category }}</span>
                    </div>
                    <h1 class="text-xl font-bold text-gray-900 mb-2">{{ selectedTicketDetails.subject }}</h1>
                    <div class="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{{ formatDate(selectedTicketDetails.createdAt) }}</span>
                      <span class="flex items-center space-x-1">
                        <User class="w-4 h-4" />
                        <span>{{ selectedTicketDetails.userId?.firstName }} {{ selectedTicketDetails.userId?.lastName }}</span>
                      </span>
                      <button @click="copyTicketId" class="hover:text-gray-700 transition-colors">
                        <Copy class="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <!-- Status Update Dropdown -->
                  <div class="flex items-center space-x-3">
                    <select 
                      v-model="selectedStatus"
                      @change="updateTicketStatus"
                      :disabled="updating"
                      class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[rgb(29,68,73)] focus:border-transparent"
                    >
                      <option value="open">Open</option>
                      <option value="closed">Closed</option>
                      <option value="resolved">Resolved</option>
                    </select>
                    
                    <div v-if="updating" class="animate-spin rounded-full h-5 w-5 border-b-2 border-[rgb(29,68,73)]"></div>
                  </div>
                </div>
              </div>
  
              <!-- Messages Section (Scrollable) -->
              <div class="flex-1 overflow-y-auto">
                <!-- Loading Messages -->
                <div v-if="fetchingMessages" class="p-6">
                  <div class="space-y-4">
                    <div v-for="i in 2" :key="i" class="animate-pulse flex space-x-3">
                      <div class="w-8 h-8 bg-gray-200 rounded-full"></div>
                      <div class="flex-1 space-y-2">
                        <div class="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div class="h-16 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
  
                <!-- Messages -->
                <div v-else class="p-6 space-y-6">
                  <div v-if="visibleMessages.length === 0" class="text-center py-8">
                    <MessageSquare class="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p class="text-gray-500">No messages yet</p>
                  </div>
  
                  <div v-for="(message, index) in visibleMessages" :key="message._id || index" class="flex space-x-3 group">
                    <div class="w-8 h-8 bg-gradient-to-br from-[rgb(29,68,73)] to-[rgb(45,85,90)] rounded-full flex items-center justify-center flex-shrink-0">
                      <span class="text-white text-xs font-semibold">
                        {{ message.repliedBy?.charAt(0) || (message.isReply ? 'S' : 'U') }}
                      </span>
                    </div>
                    <div class="flex-1 bg-gray-50 rounded-lg p-4 group-hover:bg-gray-100 transition-colors">
                      <div class="flex items-center space-x-2 mb-2">
                        <span class="text-sm font-semibold text-gray-900">
                          {{ message.repliedBy || (message.isReply ? 'Support Team' : selectedTicketDetails.userId?.firstName + ' ' + selectedTicketDetails.userId?.lastName) }}
                        </span>
                        <span class="text-xs text-gray-500">{{ formatDate(message.createdAt) }}</span>
                        <span v-if="message.isReply" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Reply
                        </span>
                      </div>
                      <div class="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap" v-html="formatMessageText(message.text)">
                      </div>
                    </div>
                  </div>
  
                  <!-- Show More/Less Messages -->
                  <div v-if="messages.length > 3" class="text-center">
                    <button 
                      @click="toggleShowAllMessages"
                      class="inline-flex items-center space-x-1 text-[rgb(29,68,73)] hover:text-[rgb(45,85,90)] text-sm font-medium transition-colors"
                    >
                      <span>{{ showAllMessages ? 'Show less messages' : `${messages.length - 3} more messages` }}</span>
                      <ChevronUp v-if="showAllMessages" class="w-4 h-4" />
                      <ChevronDown v-else class="w-4 h-4" />
                    </button>
                  </div>
  
                  <!-- Status Message -->
                  <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 text-center">
                    <p class="text-sm text-blue-700 mb-1">
                      <span class="font-medium">Status:</span> {{ formatStatus(selectedTicketDetails.status) }}
                    </p>
                    <p class="text-xs text-blue-600">Last updated: {{ formatDate(selectedTicketDetails.updatedAt) }}</p>
                  </div>
                </div>
              </div>
  
              <!-- Reply Section (Fixed) -->
              <div class="p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
                <button 
                  @click="showReplyEditor = true"
                  class="inline-flex items-center space-x-2 px-4 py-2 bg-[rgb(29,68,73)] text-white rounded-lg hover:bg-[rgb(45,85,90)] transition-colors shadow-sm"
                >
                  <MessageSquare class="w-4 h-4" />
                  <span>Send a reply</span>
                </button>
              </div>
            </div>
  
            <!-- Empty State -->
            <div v-else class="h-full flex items-center justify-center">
              <div class="text-center">
                <MessageSquare class="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 class="text-lg font-medium text-gray-900 mb-2">Select a ticket</h3>
                <p class="text-gray-500">Choose a support request to view details and conversations</p>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Enhanced Reply Editor Modal -->
      <div v-if="showReplyEditor" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          <div class="p-6 border-b border-gray-200 bg-gradient-to-r from-[rgb(29,68,73)] to-[rgb(45,85,90)]">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageSquare class="w-5 h-5 text-white" />
                </div>
                <div>
                  <span class="text-sm font-medium text-white">Reply to:</span>
                  <div class="flex items-center space-x-2 mt-1">
                    <span class="text-sm text-white/90">{{ selectedTicketDetails?.userId?.firstName }} {{ selectedTicketDetails?.userId?.lastName }}</span>
                    <span class="text-xs text-white/70">({{ selectedTicketDetails?.userId?.email }})</span>
                  </div>
                </div>
              </div>
              <button @click="showReplyEditor = false" class="text-white/80 hover:text-white transition-colors">
                <X class="w-6 h-6" />
              </button>
            </div>
          </div>
  
          <div class="p-6">
            <!-- Enhanced Formatting Toolbar -->
            <div class="border border-gray-200 rounded-lg overflow-hidden">
              <div class="flex items-center space-x-1 p-3 border-b border-gray-200 bg-gray-50 flex-wrap gap-2">
                <select v-model="selectedFormat" @change="applyFormat" class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[rgb(29,68,73)] focus:border-transparent">
                  <option value="p">Paragraph</option>
                  <option value="h1">Heading 1</option>
                  <option value="h2">Heading 2</option>
                  <option value="h3">Heading 3</option>
                </select>
                
                <div class="w-px h-6 bg-gray-300 mx-2"></div>
                
                <button @click="toggleFormat('bold')" :class="['p-2 rounded hover:bg-gray-200 transition-colors', formats.bold ? 'bg-gray-200' : '']" title="Bold">
                  <Bold class="w-4 h-4" />
                </button>
                <button @click="toggleFormat('italic')" :class="['p-2 rounded hover:bg-gray-200 transition-colors', formats.italic ? 'bg-gray-200' : '']" title="Italic">
                  <Italic class="w-4 h-4" />
                </button>
                <button @click="toggleFormat('underline')" :class="['p-2 rounded hover:bg-gray-200 transition-colors', formats.underline ? 'bg-gray-200' : '']" title="Underline">
                  <Underline class="w-4 h-4" />
                </button>
                
                <div class="w-px h-6 bg-gray-300 mx-2"></div>
                
                <button @click="setAlignment('left')" :class="['p-2 rounded hover:bg-gray-200 transition-colors', alignment === 'left' ? 'bg-gray-200' : '']" title="Align Left">
                  <AlignLeft class="w-4 h-4" />
                </button>
                <button @click="setAlignment('center')" :class="['p-2 rounded hover:bg-gray-200 transition-colors', alignment === 'center' ? 'bg-gray-200' : '']" title="Align Center">
                  <AlignCenter class="w-4 h-4" />
                </button>
                <button @click="setAlignment('right')" :class="['p-2 rounded hover:bg-gray-200 transition-colors', alignment === 'right' ? 'bg-gray-200' : '']" title="Align Right">
                  <AlignRight class="w-4 h-4" />
                </button>
                
                <div class="w-px h-6 bg-gray-300 mx-2"></div>
                
                <button @click="insertList('bullet')" class="p-2 rounded hover:bg-gray-200 transition-colors" title="Bullet List">
                  <List class="w-4 h-4" />
                </button>
                <button @click="insertList('numbered')" class="p-2 rounded hover:bg-gray-200 transition-colors" title="Numbered List">
                  <ListOrdered class="w-4 h-4" />
                </button>
                <button @click="insertLink" class="p-2 rounded hover:bg-gray-200 transition-colors" title="Insert Link">
                  <Link class="w-4 h-4" />
                </button>
              </div>
  
              <!-- Enhanced Text Editor -->
              <div class="p-4">
                <div 
                  ref="editorRef"
                  contenteditable="true"
                  @input="updateContent"
                  @keydown="handleKeydown"
                  class="w-full min-h-64 border-none resize-none focus:ring-0 focus:outline-none text-sm leading-relaxed"
                  :style="{ textAlign: alignment }"
                  placeholder="Type your reply here..."
                ></div>
              </div>
            </div>
  
            <!-- Action Buttons -->
            <div class="flex items-center justify-between mt-6">
              <div class="flex items-center space-x-4">
                <button class="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                  <Paperclip class="w-4 h-4 inline mr-1" />
                  Attach files
                </button>
              </div>
              <div class="flex items-center space-x-3">
                <button 
                  @click="showReplyEditor = false" 
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  @click="sendReply" 
                  :disabled="sending || !replyContent.trim()"
                  class="px-4 py-2 text-sm font-medium text-white bg-[rgb(29,68,73)] rounded-lg hover:bg-[rgb(45,85,90)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <div v-if="sending" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>{{ sending ? 'Sending...' : 'Send Reply' }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useGetTicketById } from "@/composables/modules/customer-support/useGetTicketById"
  import { useGetTicketMessages } from "@/composables/modules/customer-support/useGetTicketMessages"
  import { useGetTickets } from "@/composables/modules/customer-support/useGetTickets"
  import { useSendMessage } from "@/composables/modules/customer-support/useSendMessage"
  import { useUpdateTicket } from "@/composables/modules/customer-support/useUpdateTicket"
  import { ref, computed, watch, onMounted, nextTick } from 'vue'
  import { 
    ChevronDown, 
    ChevronRight, 
    ChevronUp, 
    Copy, 
    MessageSquare, 
    X, 
    Bold, 
    Italic, 
    Underline, 
    AlignLeft, 
    AlignCenter, 
    AlignRight, 
    List, 
    ListOrdered, 
    Link, 
    Paperclip,
    User
  } from 'lucide-vue-next'
  import { definePageMeta } from '#imports'
  
  // Composables
  const { loading, ticket: selectedTicketDetails, fetchTicketById } = useGetTicketById()
  const { loading: fetchingMessages, messages, fetchTicketMessages } = useGetTicketMessages()
  const { loading: fetchingTickets, tickets: ticketsList, fetchTickets } = useGetTickets()
  const { loading: sending, sendMessage } = useSendMessage()
  const { updateTicket, loading: updating } = useUpdateTicket()
  
  // Reactive state
  const activeTab = ref('open')
  const selectedTicketId = ref(null)
  const showAllMessages = ref(false)
  const showReplyEditor = ref(false)
  const replyContent = ref('')
  const selectedFormat = ref('p')
  const alignment = ref('left')
  const selectedStatus = ref('')
  const startDate = ref('')
  const endDate = ref('')
  const editorRef = ref(null)
  
  const formats = ref({
    bold: false,
    italic: false,
    underline: false
  })
  
  // Computed properties - Fixed grouping
  const filteredTickets = computed(() => {
    if (!ticketsList.value) return []
    
    let filtered = ticketsList.value.filter(ticket => {
      // Proper status filtering
      return ticket.status === activeTab.value
    })
  
    // Apply date filtering
    if (startDate.value || endDate.value) {
      filtered = filtered.filter(ticket => {
        const ticketDate = new Date(ticket.createdAt)
        const start = startDate.value ? new Date(startDate.value) : null
        const end = endDate.value ? new Date(endDate.value) : null
        
        if (start && ticketDate < start) return false
        if (end && ticketDate > end) return false
        
        return true
      })
    }
  
    return filtered
  })
  
  const visibleMessages = computed(() => {
    if (!messages.value) return []
    if (showAllMessages.value || messages.value.length <= 3) {
      return messages.value
    }
    return messages.value.slice(-3)
  })
  
  const totalTickets = computed(() => ticketsList.value?.length || 0)
  const openTicketsCount = computed(() => 
    ticketsList.value?.filter(t => t.status === 'open').length || 0
  )
  const resolvedTicketsCount = computed(() => 
    ticketsList.value?.filter(t => t.status === 'resolved').length || 0
  )
  const closedTicketsCount = computed(() => 
    ticketsList.value?.filter(t => t.status === 'closed').length || 0
  )
  
  // Methods
  const selectTicket = async (ticket) => {
    selectedTicketId.value = ticket._id
    selectedStatus.value = ticket.status
    
    // Fetch ticket details and messages
    await Promise.all([
      fetchTicketById(ticket._id),
      fetchTicketMessages(ticket._id)
    ])
    
    showAllMessages.value = false
  }
  
  const toggleShowAllMessages = () => {
    showAllMessages.value = !showAllMessages.value
  }
  
  const copyTicketId = () => {
    if (selectedTicketDetails.value) {
      navigator.clipboard.writeText(selectedTicketDetails.value._id)
    }
  }
  
  const updateTicketStatus = async () => {
    if (selectedTicketId.value && selectedStatus.value) {
      try {
        await updateTicket(selectedTicketId.value, { status: selectedStatus.value })
        await fetchTicketsData()
        await fetchTicketById(selectedTicketId.value)
      } catch (error) {
        console.error('Failed to update ticket status:', error)
      }
    }
  }
  
  const sendReply = async () => {
    if (selectedTicketId.value && replyContent.value.trim()) {
      try {
        await sendMessage(selectedTicketId.value, {
          text: replyContent.value,
        //   isReply: true,
        //   repliedBy: 'Support Team'
        })
        
        await fetchTicketMessages(selectedTicketId.value)
        
        replyContent.value = ''
        showReplyEditor.value = false
        
        if (editorRef.value) {
          editorRef.value.innerHTML = ''
        }
      } catch (error) {
        console.error('Failed to send message:', error)
      }
    }
  }
  
  const fetchTicketsData = async () => {
    const params = {}
    if (startDate.value) params.startDate = startDate.value
    if (endDate.value) params.endDate = endDate.value
    
    await fetchTickets(params)
  }
  
  const clearDateFilter = () => {
    startDate.value = ''
    endDate.value = ''
  }
  
  // Enhanced Editor Functions
  const updateContent = () => {
    if (editorRef.value) {
      replyContent.value = editorRef.value.innerHTML
    }
  }
  
  const applyFormat = () => {
    if (editorRef.value) {
      const selection = window.getSelection()
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        const element = document.createElement(selectedFormat.value)
        
        try {
          range.surroundContents(element)
        } catch (e) {
          element.appendChild(range.extractContents())
          range.insertNode(element)
        }
        
        updateContent()
      }
    }
  }
  
  const toggleFormat = (format) => {
    formats.value[format] = !formats.value[format]
    
    if (editorRef.value) {
      editorRef.value.focus()
      
      const commands = {
        bold: 'bold',
        italic: 'italic',
        underline: 'underline'
      }
      
      document.execCommand(commands[format], false, null)
      updateContent()
    }
  }
  
  const setAlignment = (align) => {
    alignment.value = align
    
    if (editorRef.value) {
      editorRef.value.focus()
      
      const commands = {
        left: 'justifyLeft',
        center: 'justifyCenter',
        right: 'justifyRight'
      }
      
      document.execCommand(commands[align], false, null)
      updateContent()
    }
  }
  
  const insertList = (type) => {
    if (editorRef.value) {
      editorRef.value.focus()
      
      const command = type === 'bullet' ? 'insertUnorderedList' : 'insertOrderedList'
      document.execCommand(command, false, null)
      updateContent()
    }
  }
  
  const insertLink = () => {
    if (editorRef.value) {
      editorRef.value.focus()
      
      const url = prompt('Enter URL:')
      if (url) {
        document.execCommand('createLink', false, url)
        updateContent()
      }
    }
  }
  
  const handleKeydown = (event) => {
    // Handle keyboard shortcuts
    if (event.ctrlKey || event.metaKey) {
      switch (event.key) {
        case 'b':
          event.preventDefault()
          toggleFormat('bold')
          break
        case 'i':
          event.preventDefault()
          toggleFormat('italic')
          break
        case 'u':
          event.preventDefault()
          toggleFormat('underline')
          break
      }
    }
  }
  
  // Utility functions
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  const formatStatus = (status) => {
    const statusMap = {
      'open': 'Open',
      'closed': 'Closed',
      'resolved': 'Resolved'
    }
    return statusMap[status] || status
  }
  
  const getStatusColor = (status) => {
    const colorMap = {
      'open': 'bg-green-400',
      'closed': 'bg-gray-400',
      'resolved': 'bg-blue-400'
    }
    return colorMap[status] || 'bg-gray-400'
  }
  
  const getStatusBadgeColor = (status) => {
    const colorMap = {
      'open': 'bg-green-100 text-green-800',
      'closed': 'bg-gray-100 text-gray-800',
      'resolved': 'bg-blue-100 text-blue-800'
    }
    return colorMap[status] || 'bg-gray-100 text-gray-800'
  }
  
  const getMessageCount = (ticketId) => {
    if (messages.value && selectedTicketId.value === ticketId) {
      return messages.value.length
    }
    return 0
  }
  
  const formatMessageText = (text) => {
    // Basic HTML formatting for messages
    return text.replace(/\n/g, '<br>')
  }
  
  // Watchers
  watch([startDate, endDate], () => {
    fetchTicketsData()
  }, { deep: true })
  
  watch(showReplyEditor, async (newVal) => {
    if (newVal) {
      await nextTick()
      if (editorRef.value) {
        editorRef.value.focus()
      }
    }
  })
  
  // Initialize
  onMounted(async () => {
    await fetchTicketsData()
    
    if (filteredTickets.value.length > 0) {
      await selectTicket(filteredTickets.value[0])
    }
  })
  
  definePageMeta({
    layout: 'dashboard'
  })
  </script>
  
  <style scoped>
  /* Enhanced scrollbar */
  .overflow-y-auto::-webkit-scrollbar {
    width: 8px;
  }
  
  .overflow-y-auto::-webkit-scrollbar-track {
    background: #f8fafc;
    border-radius: 4px;
  }
  
  .overflow-y-auto::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, rgb(29, 68, 73), rgb(45, 85, 90));
    border-radius: 4px;
  }
  
  .overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, rgb(45, 85, 90), rgb(29, 68, 73));
  }
  
  /* Smooth transitions */
  * {
    transition: all 0.2s ease-in-out;
  }
  
  /* Mobile responsive adjustments */
  @media (max-width: 1024px) {
    .lg\:flex-row {
      flex-direction: column;
    }
    
    .lg\:w-1\/3 {
      width: 100%;
    }
  }
  
  /* Enhanced animations */
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out;
  }
  </style>