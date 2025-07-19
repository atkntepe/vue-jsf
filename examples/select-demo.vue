<template>
  <div class="max-w-2xl mx-auto p-6 space-y-8">
    <div class="text-center">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        Custom SelectField Demo
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        Testing the new custom dropdown select component
      </p>
    </div>

    <!-- Basic Select -->
    <div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
      <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Basic Select
      </h2>
      
      <SelectField
        :field="{
          path: 'country',
          label: 'Country',
          required: true,
          enum: ['United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Australia', 'Japan', 'Other'],
          description: 'Select your country'
        }"
        :modelValue="selectedCountry"
        @update:modelValue="selectedCountry = $event"
        :errors="[]"
      />
      
      <div class="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded border">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Selected: <span class="font-medium text-gray-900 dark:text-gray-100">{{ selectedCountry || 'None' }}</span>
        </p>
      </div>
    </div>

    <!-- Select with Validation -->
    <div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
      <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Select with Validation Error
      </h2>
      
      <SelectField
        :field="{
          path: 'priority',
          label: 'Priority Level',
          required: true,
          enum: ['Low', 'Medium', 'High', 'Critical'],
          description: 'Choose priority level'
        }"
        :modelValue="selectedPriority"
        @update:modelValue="selectedPriority = $event"
        :errors="priorityErrors"
      />
      
      <div class="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded border">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Selected: <span class="font-medium text-gray-900 dark:text-gray-100">{{ selectedPriority || 'None' }}</span>
        </p>
        <button 
          @click="toggleError" 
          class="mt-2 px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
        >
          {{ priorityErrors.length ? 'Clear Error' : 'Show Error' }}
        </button>
      </div>
    </div>

    <!-- Select with Custom Slot -->
    <div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
      <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Select with Custom Input Slot
      </h2>
      
      <SelectField
        :field="{
          path: 'theme',
          label: 'Theme Preference',
          required: false,
          enum: ['Light', 'Dark', 'Auto'],
          description: 'Choose your theme'
        }"
        :modelValue="selectedTheme"
        @update:modelValue="selectedTheme = $event"
        :errors="[]"
      >
        <template #input="{ value, update, field }">
          <div class="relative">
            <button
              type="button"
              @click="customDropdownOpen = !customDropdownOpen"
              class="flex h-12 w-full items-center justify-between rounded-lg border-2 border-purple-300 dark:border-purple-700 bg-purple-50 dark:bg-purple-950/20 px-4 py-3 text-sm text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
            >
              <div class="flex items-center gap-2">
                <span class="text-purple-600 dark:text-purple-400">🎨</span>
                <span :class="value ? 'text-slate-900 dark:text-slate-50' : 'text-purple-400'">
                  {{ value ? `${value} Theme` : 'Choose a theme...' }}
                </span>
              </div>
              
              <svg
                class="h-5 w-5 text-purple-400 transition-transform duration-200"
                :class="{ 'transform rotate-180': customDropdownOpen }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div
              v-if="customDropdownOpen"
              class="absolute z-50 mt-2 w-full bg-white dark:bg-slate-950 border-2 border-purple-300 dark:border-purple-700 rounded-lg shadow-lg overflow-hidden"
            >
              <div
                v-for="option in field.enum"
                :key="option"
                @click="update(option); customDropdownOpen = false"
                class="flex items-center gap-3 px-4 py-3 hover:bg-purple-50 dark:hover:bg-purple-950/30 cursor-pointer transition-colors"
                :class="{ 'bg-purple-100 dark:bg-purple-900/50': value === option }"
              >
                <span class="text-lg">
                  {{ option === 'Light' ? '☀️' : option === 'Dark' ? '🌙' : '🔄' }}
                </span>
                <span class="font-medium text-slate-900 dark:text-slate-50">
                  {{ option }} Theme
                </span>
                <span v-if="value === option" class="ml-auto text-purple-600 dark:text-purple-400">
                  ✓
                </span>
              </div>
            </div>
          </div>
        </template>
      </SelectField>
      
      <div class="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded border">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Selected: <span class="font-medium text-gray-900 dark:text-gray-100">{{ selectedTheme || 'None' }}</span>
        </p>
      </div>
    </div>

    <!-- Features List -->
    <div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
      <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        New SelectField Features
      </h2>
      
      <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
        <li class="flex items-center gap-2">
          <span class="text-green-500">✓</span>
          Custom dropdown with proper styling
        </li>
        <li class="flex items-center gap-2">
          <span class="text-green-500">✓</span>
          Animated chevron rotation
        </li>
        <li class="flex items-center gap-2">
          <span class="text-green-500">✓</span>
          Keyboard navigation (Arrow keys, Enter, Escape, Home, End)
        </li>
        <li class="flex items-center gap-2">
          <span class="text-green-500">✓</span>
          Accessibility with ARIA attributes
        </li>
        <li class="flex items-center gap-2">
          <span class="text-green-500">✓</span>
          Click outside to close
        </li>
        <li class="flex items-center gap-2">
          <span class="text-green-500">✓</span>
          Selected option highlighting with check icon
        </li>
        <li class="flex items-center gap-2">
          <span class="text-green-500">✓</span>
          Smooth transitions and hover effects
        </li>
        <li class="flex items-center gap-2">
          <span class="text-green-500">✓</span>
          Dark mode support
        </li>
        <li class="flex items-center gap-2">
          <span class="text-green-500">✓</span>
          Slot extensibility (label, input, errors)
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SelectField from '../src/components/SelectField.vue';

const selectedCountry = ref('');
const selectedPriority = ref('');
const selectedTheme = ref('');
const customDropdownOpen = ref(false);

const priorityErrors = ref([]);

const toggleError = () => {
  if (priorityErrors.value.length) {
    priorityErrors.value = [];
  } else {
    priorityErrors.value = [{ $message: 'Priority is required' }];
  }
};
</script>