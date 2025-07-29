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

    <slot name="input" :value="localValue" :update="(val: any) => localValue = val" :field="field">
      <div class="relative">
        <!-- Search Input -->
        <div
          class="flex min-h-[40px] w-full rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-sm focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 dark:focus-within:ring-blue-400 focus-within:border-transparent"
          :class="[
            errors.length > 0 ? 'border-red-300 dark:border-red-700 focus-within:ring-red-500 dark:focus-within:ring-red-400' : '',
            field.classNames,
            field.hidden ? 'hidden' : ''
          ]"
          :style="field.style"
        >
          <!-- Selected Items (Chips) -->
          <div class="flex flex-wrap gap-1 mr-2" v-if="selectedItems.length > 0">
            <div
              v-for="item in selectedItems"
              :key="getItemValue(item)"
              class="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs rounded-md"
            >
              <span>{{ getItemLabel(item) }}</span>
              <button
                type="button"
                @click="removeItem(item)"
                class="hover:bg-blue-200 dark:hover:bg-blue-800/50 rounded-full p-0.5 transition-colors"
                :title="`Remove ${getItemLabel(item)}`"
              >
                <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Search Input -->
          <input
            :id="field.path"
            ref="searchInput"
            v-model="searchQuery"
            type="text"
            :placeholder="selectedItems.length > 0 ? 'Add more...' : (field.placeholder || field.description || 'Search options...')"
            class="flex-1 min-w-0 bg-transparent outline-none text-slate-900 dark:text-slate-50 placeholder:text-slate-500 dark:placeholder:text-slate-400"
            :disabled="field.disabled"
            :readonly="field.readonly"
            @focus="isOpen = true"
            @keydown="handleKeydown"
          />

          <!-- Dropdown Toggle Button -->
          <button
            type="button"
            @click="toggleDropdown"
            class="flex-shrink-0 p-1 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            :disabled="field.disabled"
            tabindex="-1"
          >
            <svg
              class="h-4 w-4 transition-transform"
              :class="{ 'rotate-180': isOpen }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        <!-- Dropdown Menu -->
        <div
          v-if="isOpen"
          class="absolute z-50 w-full mt-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          <!-- No Options Message -->
          <div
            v-if="filteredOptions.length === 0"
            class="px-3 py-2 text-sm text-slate-500 dark:text-slate-400"
          >
            {{ searchQuery ? 'No matching options found' : 'No options available' }}
          </div>

          <!-- Options List -->
          <div
            v-for="(option, index) in filteredOptions"
            :key="getItemValue(option)"
            @click="toggleOption(option)"
            class="flex items-center justify-between px-3 py-2 text-sm cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            :class="{
              'bg-slate-50 dark:bg-slate-900': index === highlightedIndex,
              'text-blue-600 dark:text-blue-400': isSelected(option)
            }"
          >
            <span class="flex-1">{{ getItemLabel(option) }}</span>
            
            <!-- Checkmark for selected items -->
            <svg
              v-if="isSelected(option)"
              class="h-4 w-4 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      </div>
    </slot>

    <!-- Help Text -->
    <div v-if="field.help" class="text-xs text-slate-600 dark:text-slate-400">
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
import { computed, ref, onMounted, onUnmounted } from "vue";
import type { FieldWithUI } from "../types";

const props = defineProps<{ 
  field: FieldWithUI; 
  modelValue: any; 
  errors: any[] 
}>();

const emit = defineEmits(["update:modelValue"]);

// Refs
const searchInput = ref<HTMLInputElement>();
const searchQuery = ref("");
const isOpen = ref(false);
const highlightedIndex = ref(-1);

// Computed properties
const localValue = computed({
  get: () => Array.isArray(props.modelValue) ? props.modelValue : [],
  set: (val) => emit("update:modelValue", val),
});

const options = computed(() => {
  if (!props.field.enum) return [];
  
  return props.field.enum.map(item => {
    if (typeof item === 'object' && item !== null && 'value' in item) {
      return item; // Already in { value, label } format
    }
    return { value: item, label: String(item) }; // Convert simple values
  });
});

const selectedItems = computed(() => {
  return options.value.filter(option => 
    localValue.value.includes(getItemValue(option))
  );
});

const filteredOptions = computed(() => {
  if (!searchQuery.value.trim()) {
    return options.value;
  }
  
  const query = searchQuery.value.toLowerCase();
  return options.value.filter(option =>
    getItemLabel(option).toLowerCase().includes(query)
  );
});

// Helper methods
const getItemValue = (item: any) => {
  return typeof item === 'object' && item !== null ? item.value : item;
};

const getItemLabel = (item: any) => {
  return typeof item === 'object' && item !== null ? (item.label || String(item.value)) : String(item);
};

const isSelected = (option: any) => {
  return localValue.value.includes(getItemValue(option));
};

// Selection methods
const toggleOption = (option: any) => {
  const value = getItemValue(option);
  const currentValues = [...localValue.value];
  
  if (currentValues.includes(value)) {
    // Remove item
    localValue.value = currentValues.filter(v => v !== value);
  } else {
    // Add item
    localValue.value = [...currentValues, value];
  }
  
  // Clear search and reset highlight
  searchQuery.value = "";
  highlightedIndex.value = -1;
  
  // Keep focus on input and keep dropdown open
  setTimeout(() => {
    if (searchInput.value) {
      searchInput.value.focus();
    }
  }, 0);
};

const removeItem = (item: any) => {
  const value = getItemValue(item);
  localValue.value = localValue.value.filter((v: any) => v !== value);
};

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    searchInput.value?.focus();
  }
};

// Keyboard navigation
const handleKeydown = (event: KeyboardEvent) => {
  if (!isOpen.value && ['ArrowDown', 'ArrowUp', 'Enter', 'Space'].includes(event.key)) {
    isOpen.value = true;
    return;
  }

  if (!isOpen.value) return;

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault();
      highlightedIndex.value = Math.min(highlightedIndex.value + 1, filteredOptions.value.length - 1);
      break;
      
    case 'ArrowUp':
      event.preventDefault();
      highlightedIndex.value = Math.max(highlightedIndex.value - 1, -1);
      break;
      
    case 'Enter':
      event.preventDefault();
      if (highlightedIndex.value >= 0 && highlightedIndex.value < filteredOptions.value.length) {
        toggleOption(filteredOptions.value[highlightedIndex.value]);
      }
      break;
      
    case 'Escape':
      event.preventDefault();
      isOpen.value = false;
      highlightedIndex.value = -1;
      searchQuery.value = "";
      break;
      
    case 'Backspace':
      if (!searchQuery.value && selectedItems.value.length > 0) {
        event.preventDefault();
        removeItem(selectedItems.value[selectedItems.value.length - 1]);
      }
      break;
  }
};

// Click outside to close
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as Element;
  if (!target.closest(`#${props.field.path}`)?.parentElement?.parentElement?.contains(target)) {
    isOpen.value = false;
    highlightedIndex.value = -1;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

// Watch for search query changes to reset highlight
const resetHighlight = () => {
  highlightedIndex.value = -1;
};

// Reset highlight when search changes
const searchQueryWatcher = () => {
  resetHighlight();
};

// Simple watcher simulation
let previousSearchQuery = searchQuery.value;
const checkSearchQuery = () => {
  if (searchQuery.value !== previousSearchQuery) {
    previousSearchQuery = searchQuery.value;
    searchQueryWatcher();
  }
  requestAnimationFrame(checkSearchQuery);
};
requestAnimationFrame(checkSearchQuery);
</script>