<template>
    <div class="relative group">
      <div class="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-primary transition-colors duration-200">
        <!-- Document available -->
        <div v-if="documentUrl" class="text-center">
          <!-- Image preview for image documents -->
          <div v-if="documentType === 'image'" class="mb-4">
            <div 
              class="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden cursor-pointer group-hover:shadow-md transition-shadow duration-200"
              @click="$emit('preview', documentUrl, title)"
            >
              <img 
                :src="documentUrl" 
                :alt="title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                @error="handleImageError"
              />
              <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                <ZoomIn class="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>
            </div>
          </div>
          
          <!-- PDF icon for PDF documents -->
          <div v-else class="mb-4">
            <div 
              class="w-full h-32 bg-red-50 rounded-lg flex items-center justify-center cursor-pointer hover:bg-red-100 transition-colors duration-200"
              @click="$emit('preview', documentUrl, title)"
            >
              <FileText class="h-12 w-12 text-red-600" />
            </div>
          </div>
          
          <h4 class="text-sm font-medium text-gray-900 mb-2">{{ title }}</h4>
          
          <!-- Verification status -->
          <div class="flex items-center justify-center mb-3">
            <span 
              class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
              :class="getVerificationStatusClass(verificationStatus)"
            >
              <component 
                :is="getVerificationIcon(verificationStatus)" 
                class="h-3 w-3 mr-1" 
              />
              {{ formatVerificationStatus(verificationStatus) }}
            </span>
          </div>
          
          <!-- Actions -->
          <div class="flex justify-center space-x-2">
            <button 
              @click="$emit('preview', documentUrl, title)"
              class="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-150"
            >
              <Eye class="h-3 w-3 mr-1" />
              View
            </button>
            <a 
              :href="documentUrl" 
              :download="title"
              class="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-150"
            >
              <Download class="h-3 w-3 mr-1" />
              Download
            </a>
          </div>
        </div>
        
        <!-- Document not available -->
        <div v-else class="text-center">
          <div class="mb-4">
            <div class="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
              <component :is="getDocumentIcon(documentType)" class="h-12 w-12 text-gray-400" />
            </div>
          </div>
          
          <h4 class="text-sm font-medium text-gray-900 mb-2">{{ title }}</h4>
          
          <div class="flex items-center justify-center mb-3">
            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
              <AlertCircle class="h-3 w-3 mr-1" />
              Not Available
            </span>
          </div>
          
          <p class="text-xs text-gray-500 mb-3">This document has not been uploaded yet.</p>
          
          <button 
            class="inline-flex items-center px-3 py-1 border border-dashed border-gray-300 rounded-md text-xs font-medium text-gray-500 hover:border-primary hover:text-primary transition-colors duration-150"
            disabled
          >
            <Upload class="h-3 w-3 mr-1" />
            Upload Required
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { 
    FileText, Eye, Download, ZoomIn, AlertCircle, Upload, 
    CheckCircle, Clock, XCircle, Camera, Shield 
  } from 'lucide-vue-next';
    import avatar from "@/assets/img/avatar-male.svg"
  
  interface Props {
    title: string;
    documentUrl?: string | null;
    isVerified?: boolean;
    verificationStatus?: string;
    documentType?: 'image' | 'pdf';
  }
  
  interface Emits {
    (e: 'preview', url: string, title: string): void;
  }
  
  const props = withDefaults(defineProps<Props>(), {
    documentUrl: null,
    isVerified: false,
    verificationStatus: 'created',
    documentType: 'image'
  });
  
  const emit = defineEmits<Emits>();
  
  const getVerificationStatusClass = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };
  
  const formatVerificationStatus = (status: string) => {
    switch (status) {
      case 'verified':
        return 'Verified';
      case 'pending':
        return 'Pending Review';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Awaiting Upload';
    }
  };
  
  const getVerificationIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return CheckCircle;
      case 'pending':
        return Clock;
      case 'rejected':
        return XCircle;
      default:
        return AlertCircle;
    }
  };
  
  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'image':
        return Camera;
      case 'pdf':
        return FileText;
      default:
        return Shield;
    }
  };
  
  const handleImageError = (event: Event) => {
    const img = event.target as HTMLImageElement;
    img.src = avatar
  };
  </script>
  