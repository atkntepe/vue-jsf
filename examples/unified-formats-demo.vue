<template>
  <div class="max-w-4xl mx-auto p-6 space-y-8">
    <div class="text-center">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        Unified Format Field Demo
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        Single FormattedField component handling multiple input formats
      </p>
    </div>

    <!-- Architecture Benefits -->
    <div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
      <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Why Unified FormattedField?
      </h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 class="text-lg font-medium mb-3 text-green-700 dark:text-green-400">
            ✅ Benefits
          </h3>
          <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li class="flex items-start gap-2">
              <span class="text-green-500 mt-0.5">•</span>
              <span><strong>Framework Compatible:</strong> Maps to single input component in any UI library</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-green-500 mt-0.5">•</span>
              <span><strong>Easier Registry:</strong> Just map "formattedfield" → "VTextField" or "UInput"</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-green-500 mt-0.5">•</span>
              <span><strong>Less Maintenance:</strong> One component handles email, tel, url formats</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-green-500 mt-0.5">•</span>
              <span><strong>Format-Aware:</strong> Uses field.format to provide appropriate behavior</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-green-500 mt-0.5">•</span>
              <span><strong>Consistent API:</strong> Same props and slots as other field components</span>
            </li>
          </ul>
        </div>
        
        <div>
          <h3 class="text-lg font-medium mb-3 text-red-700 dark:text-red-400">
            ❌ Problems with Separate Components
          </h3>
          <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li class="flex items-start gap-2">
              <span class="text-red-500 mt-0.5">•</span>
              <span>EmailField, TelField, UrlField don't exist in most UI libraries</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-red-500 mt-0.5">•</span>
              <span>Complex registry mapping for every format type</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-red-500 mt-0.5">•</span>
              <span>More components to maintain and customize</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-red-500 mt-0.5">•</span>
              <span>Users need to override multiple components for theming</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-red-500 mt-0.5">•</span>
              <span>Bundle size increases with each format component</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Live Demo -->
    <div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
      <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Live Demo: FormattedField in Action
      </h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Default Registry (Our Components)</h3>
          <SchemaForm
            :schema="formatSchema"
            v-model="formData1"
            registry="default"
          />
        </div>
        
        <div>
          <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Custom Registry (Simulated PrimeVue)</h3>
          <SchemaForm
            :schema="formatSchema"
            v-model="formData2"
            :registry="customRegistry"
          />
        </div>
      </div>
    </div>

    <!-- Registry Comparison -->
    <div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
      <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Registry Mapping Comparison
      </h2>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            ❌ OLD: Separate Components Approach
          </h3>
          <pre class="text-xs bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 p-3 rounded text-red-900 dark:text-red-100"><code>// Complex registry mapping
const primevueRegistry = {
  textfield: "InputText",
  emailfield: "InputText", // Redundant
  telfield: "InputText",   // Redundant  
  urlfield: "InputText",   // Redundant
  passwordfield: "Password",
  datefield: "Calendar",
  // ... many more mappings
};

// Problems:
// - Most UI libs don't have EmailField
// - Lots of redundant mappings
// - Hard to maintain</code></pre>
        </div>
        
        <div>
          <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            ✅ NEW: Unified Component Approach
          </h3>
          <pre class="text-xs bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 p-3 rounded text-green-900 dark:text-green-100"><code>// Clean registry mapping
const primevueRegistry = {
  textfield: "InputText",
  formattedfield: "InputText", // Handles all formats
  passwordfield: "Password",
  datefield: "Calendar",
  numberfield: "InputNumber",
  select: "Dropdown"
};

// Benefits:
// - One component handles email/tel/url
// - Maps to any UI library's input
// - Easy to maintain</code></pre>
        </div>
      </div>
    </div>

    <!-- Format Detection -->
    <div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
      <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        How Format Detection Works
      </h2>
      
      <div class="space-y-4">
        <div class="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded">
          <h4 class="font-medium text-blue-900 dark:text-blue-100 mb-2">1. Schema Parser</h4>
          <p class="text-sm text-blue-800 dark:text-blue-200">
            Detects <code>format</code> keyword in JSON Schema and maps to "formattedfield" type
          </p>
          <pre class="text-xs mt-2 bg-white dark:bg-gray-900 p-2 rounded border"><code>{ type: "string", format: "email" } → formattedfield</code></pre>
        </div>
        
        <div class="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded">
          <h4 class="font-medium text-green-900 dark:text-green-100 mb-2">2. FormattedField Component</h4>
          <p class="text-sm text-green-800 dark:text-green-200">
            Receives field.format prop and configures input type, validation, icons, and helpers
          </p>
          <pre class="text-xs mt-2 bg-white dark:bg-gray-900 p-2 rounded border"><code>format="email" → type="email" + @ icon + domain suggestions</code></pre>
        </div>
        
        <div class="p-4 bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded">
          <h4 class="font-medium text-purple-900 dark:text-purple-100 mb-2">3. Registry Override</h4>
          <p class="text-sm text-purple-800 dark:text-purple-200">
            Users can map "formattedfield" to any UI library component
          </p>
          <pre class="text-xs mt-2 bg-white dark:bg-gray-900 p-2 rounded border"><code>formattedfield: "VTextField" (Vuetify)</code></pre>
        </div>
      </div>
    </div>

    <!-- Form Data Display -->
    <div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
      <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Form Data Comparison
      </h2>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Default Registry Data</h3>
          <pre class="text-xs bg-gray-50 dark:bg-gray-800 p-3 rounded border overflow-auto text-gray-900 dark:text-gray-100"><code>{{ JSON.stringify(formData1, null, 2) }}</code></pre>
        </div>
        
        <div>
          <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Custom Registry Data</h3>
          <pre class="text-xs bg-gray-50 dark:bg-gray-800 p-3 rounded border overflow-auto text-gray-900 dark:text-gray-100"><code>{{ JSON.stringify(formData2, null, 2) }}</code></pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, markRaw, h } from 'vue';
import { SchemaForm } from '../src/index';
import TextField from '../src/components/TextField.vue';
import FormattedField from '../src/components/FormattedField.vue';

const formData1 = ref({});
const formData2 = ref({});

const formatSchema = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
      format: 'email',
      title: 'Email Address',
      description: 'Your email address'
    },
    website: {
      type: 'string',
      format: 'url',
      title: 'Website',
      description: 'Your personal website'
    },
    phone: {
      type: 'string',
      format: 'tel',
      title: 'Phone Number',
      description: 'Your contact number'
    }
  },
  required: ['email']
};

// Simulate a custom registry (like PrimeVue would look)
const customRegistry = {
  formattedfield: markRaw({
    name: 'CustomFormattedField',
    props: ['field', 'modelValue', 'errors'],
    emits: ['update:modelValue'],
    setup(props: any, { emit }: any) {
      const localValue = {
        get: () => props.modelValue,
        set: (val: any) => emit('update:modelValue', val)
      };

      return () => h('div', { class: 'space-y-2 mb-6' }, [
        h('label', { 
          class: 'block text-sm font-medium text-purple-700 dark:text-purple-300'
        }, [
          `🎨 ${props.field.label} (Custom: ${props.field.format})`,
          props.field.required ? h('span', { class: 'text-red-500 ml-1' }, '*') : null
        ]),
        h('input', {
          type: props.field.format === 'email' ? 'email' : 
                props.field.format === 'tel' ? 'tel' :
                props.field.format === 'url' ? 'url' : 'text',
          value: localValue.get(),
          onInput: (e: any) => localValue.set(e.target.value),
          placeholder: props.field.description,
          class: 'w-full px-3 py-2 border-2 border-purple-300 dark:border-purple-700 rounded-md bg-purple-50 dark:bg-purple-950/20 text-gray-900 dark:text-gray-100 placeholder-purple-400 focus:outline-none focus:border-purple-500'
        }),
        props.errors.length ? h('div', { 
          class: 'text-sm text-red-500' 
        }, props.errors[0].$message) : null
      ]);
    }
  })
};
</script>