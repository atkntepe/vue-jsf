<template>
  <div class="max-w-4xl mx-auto p-6 space-y-8">
    <div class="text-center">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        Vue-JSF Slots Demo
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        Demonstrating extensibility with named slots
      </p>
    </div>

    <!-- Example 1: Default Slot (wraps entire form) -->
    <div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
      <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        1. Default Slot (Custom Form Wrapper)
      </h2>
      
      <SchemaForm
        :schema="basicSchema"
        v-model="formData1"
        :registry="registry"
      >
        <template #default="{ fields, formData, v$, submit }">
          <div class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
            <div class="flex items-center gap-2 mb-4">
              <div class="h-2 w-2 bg-blue-500 rounded-full"></div>
              <h3 class="text-lg font-medium text-blue-900 dark:text-blue-100">Custom Form Container</h3>
            </div>
            
            <!-- Custom form header -->
            <div class="bg-white dark:bg-gray-900 p-4 rounded-md mb-4">
              <p class="text-sm text-gray-600 dark:text-gray-400">
                This form is wrapped in a custom container with validation status:
                <span :class="v$.$invalid ? 'text-red-600' : 'text-green-600'" class="font-medium">
                  {{ v$.$invalid ? 'Invalid' : 'Valid' }}
                </span>
              </p>
            </div>
            
            <!-- Render fields -->
            <div class="space-y-4">
              <component
                v-for="field in fields"
                :key="field.path"
                :is="getFieldComponent(field.type)"
                :field="field"
                :modelValue="getNestedValue(formData, field.path)"
                @update:modelValue="updateField(field.path, $event)"
                :errors="v$[field.path]?.$errors || []"
              />
            </div>
            
            <!-- Custom form footer -->
            <div class="mt-6 pt-4 border-t border-blue-200 dark:border-blue-800">
              <button 
                @click="submit" 
                :disabled="v$.$invalid"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-md font-medium transition-colors"
              >
                Submit Custom Form
              </button>
            </div>
          </div>
        </template>
      </SchemaForm>
    </div>

    <!-- Example 2: Field-specific slots -->
    <div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
      <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        2. Field-specific Slots (Custom TextField)
      </h2>
      
      <SchemaForm
        :schema="basicSchema"
        v-model="formData2"
        :registry="registry"
      >
        <!-- Custom textfield with icons and enhanced styling -->
        <template #field-textfield="{ field, value, update, errors }">
          <div class="space-y-2 mb-6">
            <label class="flex items-center gap-2 text-sm font-medium text-purple-600 dark:text-purple-400">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              {{ field.label }} (Enhanced)
              <span v-if="field.required" class="text-red-500 ml-1">*</span>
            </label>
            <div class="relative">
              <input
                :value="value"
                @input="update(($event.target as HTMLInputElement).value)"
                type="text"
                class="flex h-10 w-full rounded-md border-2 border-purple-300 dark:border-purple-700 bg-purple-50 dark:bg-purple-950/20 px-3 py-2 pl-10 text-sm text-slate-900 dark:text-slate-50 placeholder:text-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                :placeholder="field.description || 'Enter value...'"
              />
              <div class="absolute left-3 top-1/2 transform -translate-y-1/2">
                <svg class="h-4 w-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                </svg>
              </div>
            </div>
            <div v-if="errors.length" class="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              {{ errors[0].$message }}
            </div>
          </div>
        </template>
      </SchemaForm>
    </div>

    <!-- Example 3: Array controls slot -->
    <div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
      <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        3. Array Controls Slot (Custom Add/Remove)
      </h2>
      
      <SchemaForm
        :schema="arraySchema"
        v-model="formData3"
        :registry="registry"
      >
        <!-- Custom array controls -->
        <template #array-controls="{ addFn, removeFn, itemsLength, canAdd, canRemove }">
          <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
            <div class="flex items-center gap-3">
              <div class="text-sm text-gray-600 dark:text-gray-400">
                Items: <span class="font-medium text-gray-900 dark:text-gray-100">{{ itemsLength }}</span>
              </div>
              <div class="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                Array Field
              </div>
            </div>
            
            <div class="flex items-center gap-2">
              <button
                @click="addFn"
                :disabled="!canAdd"
                class="inline-flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white text-sm font-medium rounded-md transition-colors"
                type="button"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Add New Item
              </button>
              
              <button
                @click="() => removeFn(itemsLength - 1)"
                :disabled="!canRemove"
                class="inline-flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white text-sm font-medium rounded-md transition-colors"
                type="button"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
                Remove Last
              </button>
            </div>
          </div>
        </template>
      </SchemaForm>
    </div>

    <!-- Example 4: Granular field slots -->
    <div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
      <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        4. Granular Field Slots (Custom Label, Input, Errors)
      </h2>
      
      <TextField
        :field="{ path: 'demo', label: 'Demo Field', required: true, description: 'This is a demo' }"
        :modelValue="granularDemo"
        @update:modelValue="granularDemo = $event"
        :errors="[]"
      >
        <!-- Custom label slot -->
        <template #label="{ field }">
          <div class="flex items-center justify-between mb-2">
            <label class="text-sm font-medium text-orange-600 dark:text-orange-400">
              🏷️ {{ field.label }} (Custom Label)
              <span v-if="field.required" class="text-red-500 ml-1">*</span>
            </label>
            <div class="text-xs px-2 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded">
              Required
            </div>
          </div>
        </template>
        
        <!-- Custom input slot -->
        <template #input="{ value, update, field }">
          <div class="relative">
            <input
              :value="value"
              @input="update(($event.target as HTMLInputElement).value)"
              type="text"
              class="flex h-12 w-full rounded-lg border-2 border-orange-300 dark:border-orange-700 bg-orange-50 dark:bg-orange-950/20 px-4 py-3 text-sm text-slate-900 dark:text-slate-50 placeholder:text-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-sm"
              :placeholder="field.description"
            />
            <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div class="h-2 w-2 bg-orange-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </template>
        
        <!-- Custom errors slot -->
        <template #errors="{ errors }">
          <div v-if="errors.length" class="mt-2 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-md">
            <div class="flex items-center gap-2">
              <svg class="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
              <span class="text-sm font-medium text-red-800 dark:text-red-200">Validation Error:</span>
              <span class="text-sm text-red-700 dark:text-red-300">{{ errors[0].$message }}</span>
            </div>
          </div>
        </template>
      </TextField>
    </div>

    <!-- Form Data Display -->
    <div class="bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
      <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Form Data
      </h2>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Default Slot Form</h3>
          <pre class="text-xs bg-white dark:bg-gray-800 p-3 rounded border overflow-auto">{{ JSON.stringify(formData1, null, 2) }}</pre>
        </div>
        <div>
          <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Field Slot Form</h3>
          <pre class="text-xs bg-white dark:bg-gray-800 p-3 rounded border overflow-auto">{{ JSON.stringify(formData2, null, 2) }}</pre>
        </div>
        <div>
          <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Array Slot Form</h3>
          <pre class="text-xs bg-white dark:bg-gray-800 p-3 rounded border overflow-auto">{{ JSON.stringify(formData3, null, 2) }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, markRaw } from 'vue';
import { SchemaForm } from '../src/index';
import TextField from '../src/components/TextField.vue';
import NumberField from '../src/components/NumberField.vue';
import ArrayField from '../src/components/ArrayField.vue';

const registry = {
  textfield: markRaw(TextField),
  numberfield: markRaw(NumberField),
  arrayfield: markRaw(ArrayField),
};

const basicSchema = {
  type: 'object',
  properties: {
    name: { type: 'string', title: 'Full Name', minLength: 2 },
    age: { type: 'number', title: 'Age', minimum: 18 },
  },
  required: ['name', 'age'],
};

const arraySchema = {
  type: 'object',
  properties: {
    skills: {
      type: 'array',
      title: 'Skills',
      items: { type: 'string', title: 'Skill' },
      minItems: 1,
      maxItems: 5,
    },
  },
  required: ['skills'],
};

const formData1 = ref({});
const formData2 = ref({});
const formData3 = ref({});
const granularDemo = ref('');

// Helper functions (simplified versions of SchemaForm internals)
const getFieldComponent = (type: string) => {
  return registry[type as keyof typeof registry] || 'div';
};

const getNestedValue = (data: any, path: string) => {
  return path.split('.').reduce((obj, key) => obj?.[key], data);
};

const updateField = (path: string, value: any) => {
  // This is a simplified version - in real implementation this would be more complex
  const keys = path.split('.');
  // Implementation would handle nested object updates
};
</script>