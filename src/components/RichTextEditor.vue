<template>
  <div class="space-y-2 mb-6">
    <slot name="label" :field="field">
      <label
        :for="field.path"
        class="text-sm font-medium text-gray-900 dark:text-gray-100"
      >
        {{ field.label }}
        <span v-if="field.required" class="text-red-500 ml-1">*</span>
      </label>
    </slot>

    <slot name="input" :value="localValue" :update="(val: string) => localValue = val" :field="field">
      <div
        class="relative"
        :class="[
          errors.length > 0 ? 'border-red-300 dark:border-red-700' : '',
          field.classNames,
          field.hidden ? 'hidden' : ''
        ]"
        :style="field.style"
      >
        <!-- Quill Editor -->
        <QuillEditor
          :id="field.path"
          v-model:content="localValue"
          content-type="html"
          :options="quillOptions"
          :disabled="field.disabled || field.readonly"
          :placeholder="field.placeholder || field.description || 'Enter rich text...'"
          @focus="handleFocus"
          @blur="handleBlur"
          @ready="handleReady"
          class="rich-text-editor"
          :class="{
            'editor-error': errors.length > 0,
            'editor-disabled': field.disabled || field.readonly
          }"
        />
        
        <!-- Character counter (if maxLength is specified) -->
        <div
          v-if="field.maxLength"
          class="absolute bottom-2 right-2 text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 px-2 py-1 rounded shadow-sm"
        >
          {{ characterCount }}/{{ field.maxLength }}
        </div>
      </div>
    </slot>

    <!-- Help Text -->
    <div v-if="field.help" class="text-xs text-gray-600 dark:text-gray-400">
      {{ field.help }}
    </div>

    <slot name="errors" :errors="errors">
      <div v-if="errors.length" class="text-sm text-red-500 dark:text-red-400">
        {{ errors[0].$message }}
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import type { FieldWithUI } from "../types";

// Note: Quill 1.3.7 (used by @vueup/vue-quill) generates a deprecation warning 
// about DOMNodeInserted mutation events. This is a known third-party library 
// issue that doesn't affect functionality and will be resolved in future updates.

const props = defineProps<{ 
  field: FieldWithUI; 
  modelValue: string | undefined; 
  errors: any[] 
}>();

const emit = defineEmits(["update:modelValue", "focus", "blur"]);

// Local reactive value
const localValue = computed({
  get: () => props.modelValue || '',
  set: (val) => emit("update:modelValue", val),
});

// Editor instance reference
const editorInstance = ref<any>(null);

// Quill editor configuration
const quillOptions = computed(() => {
  const baseOptions = {
    theme: 'snow',
    modules: {
      toolbar: getToolbarConfig(),
      history: {
        delay: 1000,
        maxStack: 50,
        userOnly: false
      }
    },
    formats: [
      'header', 'font', 'size',
      'bold', 'italic', 'underline', 'strike',
      'color', 'background',
      'script', 'blockquote', 'code-block',
      'list', 'bullet', 'indent',
      'direction', 'align',
      'link', 'image', 'video',
      'clean'
    ],
    placeholder: props.field.placeholder || props.field.description || 'Enter rich text...',
    readOnly: props.field.disabled || props.field.readonly,
    bounds: document.body,
    scrollingContainer: null,
  };

  // Apply custom options from field configuration
  if (props.field.editorOptions) {
    return { ...baseOptions, ...props.field.editorOptions };
  }

  return baseOptions;
});

// Get toolbar configuration based on field settings
const getToolbarConfig = () => {
  // If custom toolbar is specified in field, use it
  if (props.field.toolbar) {
    return props.field.toolbar;
  }

  // Default comprehensive toolbar
  const defaultToolbar = [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'font': [] }, { 'size': ['small', false, 'large', 'huge'] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'script': 'sub'}, { 'script': 'super' }],
    ['blockquote', 'code-block'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'indent': '-1'}, { 'indent': '+1' }],
    [{ 'direction': 'rtl' }, { 'align': [] }],
    ['link', 'image', 'video'],
    ['clean']
  ];

  // Simplified toolbar for basic use
  const basicToolbar = [
    ['bold', 'italic', 'underline'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['link'],
    ['clean']
  ];

  // Minimal toolbar
  const minimalToolbar = [
    ['bold', 'italic'],
    ['clean']
  ];

  // Choose toolbar based on field configuration
  switch (props.field.toolbarStyle) {
    case 'basic':
      return basicToolbar;
    case 'minimal':
      return minimalToolbar;
    case 'full':
    default:
      return defaultToolbar;
  }
};

// Character count for validation
const characterCount = computed(() => {
  if (!localValue.value) return 0;
  // Strip HTML tags for character counting
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = localValue.value;
  return tempDiv.textContent?.length || 0;
});

// Validate character limit
watch(characterCount, (newCount) => {
  if (props.field.maxLength && newCount > props.field.maxLength) {
    // Character limit exceeded - visual indicator shows in UI
  }
});

// Event handlers
const handleFocus = () => {
  emit("focus");
};

const handleBlur = () => {
  emit("blur");
};

const handleReady = (editor: any) => {
  editorInstance.value = editor;
};

// Expose editor instance and methods
defineExpose({
  getEditor: () => editorInstance.value,
  focus: () => editorInstance.value?.focus(),
  blur: () => editorInstance.value?.blur(),
  getLength: () => editorInstance.value?.getLength() || 0,
  getText: () => editorInstance.value?.getText() || '',
  getHTML: () => editorInstance.value?.root?.innerHTML || '',
  insertText: (index: number, text: string) => editorInstance.value?.insertText(index, text),
  insertEmbed: (index: number, type: string, value: any) => editorInstance.value?.insertEmbed(index, type, value),
});
</script>

<style scoped>
/* Custom styles for the rich text editor */
.rich-text-editor {
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
}

.rich-text-editor :deep(.ql-toolbar) {
  border-bottom: 1px solid #e5e7eb;
  background-color: #f9fafb;
  border-top-left-radius: 0.375rem;
  border-top-right-radius: 0.375rem;
}

.rich-text-editor :deep(.ql-container) {
  border: 0;
  background-color: white;
  color: #111827;
  border-bottom-left-radius: 0.375rem;
  border-bottom-right-radius: 0.375rem;
}

.rich-text-editor :deep(.ql-editor) {
  min-height: 120px;
  font-size: 0.875rem;
  line-height: 1.625;
}

.rich-text-editor :deep(.ql-editor.ql-blank::before) {
  color: #9ca3af;
  font-style: italic;
}

/* Error state */
.editor-error {
  border-color: #fca5a5;
}

.editor-error :deep(.ql-toolbar) {
  border-bottom-color: #fca5a5;
}

/* Disabled state */
.editor-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.editor-disabled :deep(.ql-toolbar) {
  background-color: #f3f4f6;
}

.editor-disabled :deep(.ql-editor) {
  background-color: #f3f4f6;
  cursor: not-allowed;
}

/* Dark mode adjustments */
@media (prefers-color-scheme: dark) {
  .rich-text-editor {
    border-color: #374151;
  }

  .rich-text-editor :deep(.ql-toolbar) {
    border-bottom-color: #374151;
    background-color: #111827;
  }

  .rich-text-editor :deep(.ql-container) {
    background-color: #030712;
    color: #f9fafb;
  }

  .rich-text-editor :deep(.ql-editor.ql-blank::before) {
    color: #6b7280;
  }

  .editor-error {
    border-color: #b91c1c;
  }

  .editor-error :deep(.ql-toolbar) {
    border-bottom-color: #b91c1c;
  }

  .editor-disabled :deep(.ql-toolbar) {
    background-color: #1f2937;
  }

  .editor-disabled :deep(.ql-editor) {
    background-color: #1f2937;
  }

  .rich-text-editor :deep(.ql-toolbar .ql-stroke) {
    stroke: #9ca3af;
  }

  .rich-text-editor :deep(.ql-toolbar .ql-fill) {
    fill: #9ca3af;
  }

  .rich-text-editor :deep(.ql-toolbar button:hover .ql-stroke),
  .rich-text-editor :deep(.ql-toolbar button:focus .ql-stroke),
  .rich-text-editor :deep(.ql-toolbar button.ql-active .ql-stroke) {
    stroke: #f9fafb;
  }

  .rich-text-editor :deep(.ql-toolbar button:hover .ql-fill),
  .rich-text-editor :deep(.ql-toolbar button:focus .ql-fill),
  .rich-text-editor :deep(.ql-toolbar button.ql-active .ql-fill) {
    fill: #f9fafb;
  }

  .rich-text-editor :deep(.ql-tooltip) {
    background-color: #1f2937;
    border-color: #374151;
    color: #e5e7eb;
  }

  .rich-text-editor :deep(.ql-tooltip input) {
    background-color: #111827;
    border-color: #4b5563;
    color: #e5e7eb;
  }
}
</style>