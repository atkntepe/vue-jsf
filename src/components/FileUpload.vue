<template>
  <div class="space-y-2 mb-6">
    <slot name="label" :field="field">
      <label
        :for="field.path"
        class="text-sm font-medium text-slate-900 dark:text-slate-100"
      >
        {{ field.label }}
        <span v-if="field.required" class="text-red-500 ml-1">*</span>
      </label>
    </slot>

    <slot name="input" :value="localValue" :update="handleFileUpload" :field="field">
      <div
        class="relative border-2 border-dashed rounded-lg transition-colors"
        :class="[
          isDragOver
            ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/20'
            : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500',
          errors.length > 0 ? 'border-red-300 dark:border-red-700' : ''
        ]"
        @dragover.prevent="handleDragOver"
        @dragleave.prevent="handleDragLeave"
        @drop.prevent="handleDrop"
      >
        <input
          :id="field.path"
          ref="fileInput"
          type="file"
          :multiple="isMultiple"
          :accept="acceptedTypes"
          class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          @change="handleFileSelect"
        />

        <div class="p-6 text-center">
          <div class="mx-auto h-12 w-12 mb-4">
            <svg
              class="h-full w-full text-slate-400 dark:text-slate-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>

          <div class="space-y-2">
            <p class="text-sm text-slate-900 dark:text-slate-100">
              <button
                type="button"
                class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                @click="() => fileInput?.click?.()"
              >
                Click to upload
              </button>
              <span class="text-slate-500 dark:text-slate-400"> or drag and drop</span>
            </p>
            
            <div class="text-xs text-slate-500 dark:text-slate-400 space-y-1">
              <p v-if="acceptedTypes && acceptedTypes !== '*/*'">
                Accepted: {{ formatAcceptedTypes(acceptedTypes) }}
              </p>
              <p v-if="maxSize">
                Max file size: {{ formatFileSize(maxSize) }}
              </p>
              <p v-if="isMultiple">
                {{ field.minItems ? `${field.minItems}-` : '' }}{{ field.maxItems || 'Multiple' }} files allowed
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- File Preview -->
      <div v-if="previewFiles.length > 0" class="space-y-2 mt-3">
        <div class="text-sm font-medium text-slate-900 dark:text-slate-100">
          Selected Files ({{ previewFiles.length }})
        </div>
        <div class="space-y-2 max-h-40 overflow-y-auto">
          <div
            v-for="(file, index) in previewFiles"
            :key="`${file.name}-${index}`"
            class="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700"
          >
            <div class="flex items-center space-x-3 flex-1 min-w-0">
              <!-- File Icon -->
              <div class="flex-shrink-0">
                <component :is="getFileIcon(file)" class="h-5 w-5 text-slate-500 dark:text-slate-400" />
              </div>
              
              <!-- File Info -->
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                  {{ file.name }}
                </p>
                <p class="text-xs text-slate-500 dark:text-slate-400">
                  {{ formatFileSize(file.size) }}
                </p>
              </div>

              <!-- Image Preview -->
              <div v-if="file.preview" class="flex-shrink-0">
                <img
                  :src="file.preview"
                  :alt="file.name"
                  class="h-10 w-10 object-cover rounded border"
                />
              </div>
            </div>

            <!-- Remove Button -->
            <button
              type="button"
              @click="removeFile(index)"
              class="ml-2 flex-shrink-0 p-1 text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 transition-colors"
              title="Remove file"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Upload Progress (if needed for future enhancements) -->
      <div v-if="isUploading" class="mt-3">
        <div class="flex items-center justify-between text-sm mb-1">
          <span class="text-slate-900 dark:text-slate-100">Uploading...</span>
          <span class="text-slate-500 dark:text-slate-400">{{ uploadProgress }}%</span>
        </div>
        <div class="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
          <div
            class="bg-blue-600 h-2 rounded-full transition-all duration-300"
            :style="{ width: `${uploadProgress}%` }"
          ></div>
        </div>
      </div>
    </slot>

    <slot name="errors" :errors="errors">
      <div v-if="errors.length" class="text-sm text-red-500 dark:text-red-400">
        {{ errors[0].$message }}
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, h } from "vue";
import type { FieldWithUI } from "../types";

const props = defineProps<{ 
  field: FieldWithUI; 
  modelValue: any; 
  errors: any[] 
}>();

const emit = defineEmits(["update:modelValue"]);

// Refs
const fileInput = ref<HTMLInputElement>();
const isDragOver = ref(false);
const previewFiles = ref<Array<File & { preview?: string }>>([]);
const isUploading = ref(false);
const uploadProgress = ref(0);

// Computed properties
const localValue = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const isMultiple = computed(() => props.field.type === 'array');
const acceptedTypes = computed(() => props.field.accept || props.field.format || '*/*');
const maxSize = computed(() => props.field.maxSize);

// File handling
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    processFiles(Array.from(target.files));
  }
};

const handleDrop = (event: DragEvent) => {
  isDragOver.value = false;
  if (event.dataTransfer?.files) {
    processFiles(Array.from(event.dataTransfer.files));
  }
};

const handleDragOver = () => {
  isDragOver.value = true;
};

const handleDragLeave = () => {
  isDragOver.value = false;
};

const processFiles = async (files: File[]) => {
  const validFiles: Array<File & { preview?: string }> = [];
  
  for (const file of files) {
    // Validate file type
    if (acceptedTypes.value !== '*/*' && !isFileTypeAccepted(file, acceptedTypes.value)) {
      continue;
    }
    
    // Validate file size
    if (maxSize.value && file.size > maxSize.value) {
      continue;
    }
    
    // Add preview for images
    if (file.type.startsWith('image/')) {
      const preview = await createImagePreview(file);
      (file as any).preview = preview;
    }
    
    validFiles.push(file);
  }
  
  if (isMultiple.value) {
    previewFiles.value = [...previewFiles.value, ...validFiles];
    handleFileUpload(previewFiles.value);
  } else if (validFiles.length > 0) {
    previewFiles.value = [validFiles[0]];
    handleFileUpload(validFiles[0]);
  }
};

const handleFileUpload = (value: File | File[]) => {
  localValue.value = value;
};

const removeFile = (index: number) => {
  previewFiles.value.splice(index, 1);
  
  if (isMultiple.value) {
    handleFileUpload(previewFiles.value);
  } else {
    handleFileUpload(undefined as any);
  }
};

// Utility functions
const isFileTypeAccepted = (file: File, acceptString: string): boolean => {
  const acceptedTypes = acceptString.split(',').map(type => type.trim());
  
  return acceptedTypes.some(acceptedType => {
    if (acceptedType === '*/*') return true;
    if (acceptedType.endsWith('/*')) {
      const baseType = acceptedType.replace('/*', '');
      return file.type.startsWith(baseType + '/');
    }
    return file.type === acceptedType || file.name.toLowerCase().endsWith(acceptedType);
  });
};

const createImagePreview = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.readAsDataURL(file);
  });
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatAcceptedTypes = (accept: string): string => {
  return accept.split(',').map(type => type.trim()).join(', ');
};

const getFileIcon = (file: File) => {
  const type = file.type;
  
  if (type.startsWith('image/')) {
    return () => h("svg", {
      fill: "none",
      stroke: "currentColor",
      viewBox: "0 0 24 24"
    }, [
      h("path", {
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "2",
        d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
      })
    ]);
  }
  
  if (type.includes('pdf')) {
    return () => h("svg", {
      fill: "currentColor",
      viewBox: "0 0 24 24"
    }, [
      h("path", {
        d: "M8.267 14.68c-.184 0-.308.018-.372.036v1.178c.076.018.171.023.302.023.479 0 .774-.242.774-.651 0-.366-.254-.586-.704-.586zm3.487.012c-.2 0-.33.018-.407.036v2.61c.077.018.201.018.313.018.817.006 1.349-.444 1.349-1.396.006-.83-.479-1.268-1.255-1.268z"
      }),
      h("path", {
        d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM9.498 16.19c-.309.29-.765.42-1.296.42a2.23 2.23 0 0 1-.308-.018v1.426H7v-3.936A7.558 7.558 0 0 1 8.219 14c.557 0 .953.106 1.22.319.254.202.426.533.426.923-.001.392-.131.723-.367.948zm3.807 1.355c-.42.349-1.059.515-1.84.515-.468 0-.799-.03-1.024-.06v-3.917A7.947 7.947 0 0 1 11.66 14c.757 0 1.249.136 1.633.426.415.308.675.799.675 1.504 0 .763-.279 1.29-.663 1.615zM17 14.77h-1.532v.911H16.9v.734h-1.432v1.604h-.906V14.03H17v.74zM14 9h-1V4l5 5h-4z"
      })
    ]);
  }
  
  if (type.startsWith('text/') || type.includes('document')) {
    return () => h("svg", {
      fill: "none",
      stroke: "currentColor",
      viewBox: "0 0 24 24"
    }, [
      h("path", {
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "2",
        d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      })
    ]);
  }
  
  // Default file icon
  return () => h("svg", {
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, [
    h("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "stroke-width": "2",
      d: "M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
    })
  ]);
};
</script>