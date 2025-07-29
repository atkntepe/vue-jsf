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

    <slot
      name="input"
      :value="localValue"
      :update="(val: any) => (localValue = val)"
      :field="field"
    >
      <div class="relative" ref="selectContainer">
        <button
          :id="field.path"
          type="button"
          @click="toggleDropdown"
          @keydown="handleKeydown"
          :aria-expanded="isOpen"
          :aria-haspopup="true"
          class="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
          :class="{
            'ring-2 ring-blue-500 dark:ring-blue-400 border-transparent':
              isOpen,
          }"
        >
          <span
            :class="
              localValue
                ? 'text-slate-900 dark:text-slate-50'
                : 'text-slate-500 dark:text-slate-400'
            "
          >
            {{ displayValue || "Select an option" }}
          </span>

          <svg
            class="h-4 w-4 text-slate-400 dark:text-slate-500 transition-transform duration-200"
            :class="{ 'transform rotate-180': isOpen }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="transform scale-95 opacity-0"
          enter-to-class="transform scale-100 opacity-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="transform scale-100 opacity-100"
          leave-to-class="transform scale-95 opacity-0"
        >
          <div
            v-if="isOpen"
            class="absolute z-50 mt-1 w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md shadow-lg max-h-60 overflow-auto"
            role="listbox"
            :aria-labelledby="field.path"
          >
            <div class="py-1">
              <div
                v-for="(option, index) in field.enum"
                :key="getOptionKey(option, index)"
                @click="selectOption(option)"
                @mouseenter="highlightedIndex = index"
                :class="[
                  'relative cursor-pointer select-none py-2 px-3 text-sm transition-colors',
                  {
                    'bg-blue-50 dark:bg-blue-950/50 text-blue-900 dark:text-blue-100':
                      highlightedIndex === index,
                    'text-slate-900 dark:text-slate-50 hover:bg-slate-100 dark:hover:bg-slate-800':
                      highlightedIndex !== index,
                    'bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 font-medium':
                      getOptionValue(option) === localValue,
                  },
                ]"
                role="option"
                :aria-selected="getOptionValue(option) === localValue"
              >
                <span class="block truncate">{{ getOptionLabel(option) }}</span>

                <svg
                  v-if="getOptionValue(option) === localValue"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </Transition>
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
import { computed, ref, onMounted, onUnmounted } from "vue";
import type { FieldWithUI } from "../types";

const props = defineProps<{ field: FieldWithUI; modelValue: any; errors: any[] }>();
const emit = defineEmits(["update:modelValue"]);

const isOpen = ref(false);
const highlightedIndex = ref(-1);
const selectContainer = ref<HTMLElement>();

const localValue = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

// Helper functions to safely handle null values and object/primitive options
const getOptionValue = (option: any) => {
  if (option === null || option === undefined) return option;
  return typeof option === 'object' && option !== null ? option.value : option;
};

const getOptionLabel = (option: any) => {
  if (option === null) return 'null';
  if (option === undefined) return 'undefined';
  if (typeof option === 'object' && option !== null && option.label) {
    return option.label;
  }
  return String(option);
};

const getOptionKey = (option: any, index: number) => {
  if (option === null) return `null-${index}`;
  if (option === undefined) return `undefined-${index}`;
  if (typeof option === 'object' && option !== null) {
    return `${option.value}-${index}`;
  }
  return `${option}-${index}`;
};

const displayValue = computed(() => {
  if (localValue.value === null) return 'null';
  if (localValue.value === undefined || localValue.value === '') return '';
  
  // Handle object enum format {value, label}
  const option = props.field.enum?.find((opt: any) => 
    getOptionValue(opt) === localValue.value
  );
  
  if (option) {
    return getOptionLabel(option);
  }
  
  return String(localValue.value);
});

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    // Find current option index, handling both string and object enum formats
    const currentIndex = props.field.enum?.findIndex((opt: any) => 
      getOptionValue(opt) === localValue.value
    ) ?? -1;
    highlightedIndex.value = currentIndex;
  }
};

const selectOption = (option: any) => {
  // Handle object enum format {value, label}
  const value = getOptionValue(option);
  localValue.value = value;
  isOpen.value = false;
  highlightedIndex.value = -1;
};

const handleKeydown = (event: KeyboardEvent) => {
  const options = props.field.enum || [];

  switch (event.key) {
    case "Enter":
    case " ":
      event.preventDefault();
      if (isOpen.value && highlightedIndex.value >= 0) {
        selectOption(options[highlightedIndex.value]);
      } else {
        toggleDropdown();
      }
      break;

    case "Escape":
      if (isOpen.value) {
        event.preventDefault();
        isOpen.value = false;
        highlightedIndex.value = -1;
      }
      break;

    case "ArrowDown":
      event.preventDefault();
      if (!isOpen.value) {
        toggleDropdown();
      } else {
        highlightedIndex.value = Math.min(
          highlightedIndex.value + 1,
          options.length - 1,
        );
      }
      break;

    case "ArrowUp":
      event.preventDefault();
      if (isOpen.value) {
        highlightedIndex.value = Math.max(highlightedIndex.value - 1, 0);
      }
      break;

    case "Home":
      if (isOpen.value) {
        event.preventDefault();
        highlightedIndex.value = 0;
      }
      break;

    case "End":
      if (isOpen.value) {
        event.preventDefault();
        highlightedIndex.value = options.length - 1;
      }
      break;
  }
};

const handleClickOutside = (event: Event) => {
  if (
    selectContainer.value &&
    !selectContainer.value.contains(event.target as Node)
  ) {
    isOpen.value = false;
    highlightedIndex.value = -1;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
