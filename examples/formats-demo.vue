<template>
  <div class="max-w-4xl mx-auto p-6 space-y-8">
    <div class="text-center">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        Vue-JSF Format Support Demo
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        Intelligent form components based on JSON Schema format keywords
      </p>
    </div>

    <!-- Format Overview -->
    <div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
      <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Supported Formats
      </h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
        <div v-for="format in supportedFormats" :key="format.name" class="p-3 bg-gray-50 dark:bg-gray-800 rounded border">
          <div class="flex items-center gap-2 mb-1">
            <span class="font-medium text-gray-900 dark:text-gray-100">{{ format.name }}</span>
            <span class="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
              {{ format.type }}
            </span>
          </div>
          <p class="text-gray-600 dark:text-gray-400 text-xs">{{ format.description }}</p>
          <p class="text-gray-500 dark:text-gray-500 text-xs mt-1">Example: {{ format.example }}</p>
        </div>
      </div>
    </div>

    <!-- Live Demo Form -->
    <div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
      <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Live Demo: User Registration Form
      </h2>
      
      <SchemaForm
        :schema="demoSchema"
        v-model="formData"
        :registry="registry"
      />
    </div>

    <!-- Schema Display -->
    <div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
      <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        JSON Schema with Formats
      </h2>
      
      <pre class="text-xs bg-gray-50 dark:bg-gray-800 p-4 rounded border overflow-auto text-gray-900 dark:text-gray-100"><code>{{ JSON.stringify(demoSchema, null, 2) }}</code></pre>
    </div>

    <!-- Generated Form Data -->
    <div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
      <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Generated Form Data
      </h2>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Raw JSON</h3>
          <pre class="text-xs bg-gray-50 dark:bg-gray-800 p-3 rounded border overflow-auto text-gray-900 dark:text-gray-100"><code>{{ JSON.stringify(formData, null, 2) }}</code></pre>
        </div>
        
        <div>
          <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Field Analysis</h3>
          <div class="space-y-2 text-xs">
            <div v-for="(value, key) in formData" :key="key" class="flex justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <span class="font-medium text-gray-900 dark:text-gray-100">{{ key }}:</span>
              <span class="text-gray-600 dark:text-gray-400">{{ getFieldType(key) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Format Benefits -->
    <div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
      <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Format Benefits
      </h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 class="text-lg font-medium mb-3 text-gray-900 dark:text-gray-100">User Experience</h3>
          <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li class="flex items-center gap-2">
              <span class="text-green-500">✓</span>
              Smart input types (email keyboard, date picker, etc.)
            </li>
            <li class="flex items-center gap-2">
              <span class="text-green-500">✓</span>
              Real-time validation feedback
            </li>
            <li class="flex items-center gap-2">
              <span class="text-green-500">✓</span>
              Format-specific helpers (URL preview, phone formatting)
            </li>
            <li class="flex items-center gap-2">
              <span class="text-green-500">✓</span>
              Password strength indicators
            </li>
            <li class="flex items-center gap-2">
              <span class="text-green-500">✓</span>
              Date quick options and relative dates
            </li>
          </ul>
        </div>
        
        <div>
          <h3 class="text-lg font-medium mb-3 text-gray-900 dark:text-gray-100">Developer Benefits</h3>
          <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li class="flex items-center gap-2">
              <span class="text-blue-500">✓</span>
              Zero configuration - works with existing schemas
            </li>
            <li class="flex items-center gap-2">
              <span class="text-blue-500">✓</span>
              Built-in format validation rules
            </li>
            <li class="flex items-center gap-2">
              <span class="text-blue-500">✓</span>
              Consistent with JSON Schema Draft 7+ spec
            </li>
            <li class="flex items-center gap-2">
              <span class="text-blue-500">✓</span>
              Compatible with OpenAPI/Swagger schemas
            </li>
            <li class="flex items-center gap-2">
              <span class="text-blue-500">✓</span>
              Extensible via slots and custom components
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Format Validation Examples -->
    <div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
      <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Format Validation Examples
      </h2>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Valid Examples</h3>
          <div class="space-y-2 text-xs">
            <div v-for="example in validExamples" :key="example.format" class="p-2 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded">
              <div class="font-medium text-green-800 dark:text-green-200">{{ example.format }}</div>
              <div class="text-green-600 dark:text-green-400 font-mono">{{ example.value }}</div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Invalid Examples</h3>
          <div class="space-y-2 text-xs">
            <div v-for="example in invalidExamples" :key="example.format" class="p-2 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded">
              <div class="font-medium text-red-800 dark:text-red-200">{{ example.format }}</div>
              <div class="text-red-600 dark:text-red-400 font-mono">{{ example.value }}</div>
              <div class="text-red-500 dark:text-red-400 text-xs mt-1">{{ example.error }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, markRaw, computed } from 'vue';
import { SchemaForm } from '../src/index';
import TextField from '../src/components/TextField.vue';
import NumberField from '../src/components/NumberField.vue';
import FormattedField from '../src/components/FormattedField.vue';
import PasswordField from '../src/components/PasswordField.vue';
import DateField from '../src/components/DateField.vue';
import SelectField from '../src/components/SelectField.vue';

const registry = {
  textfield: markRaw(TextField),
  numberfield: markRaw(NumberField),
  formattedfield: markRaw(FormattedField),
  passwordfield: markRaw(PasswordField),
  datefield: markRaw(DateField),
  select: markRaw(SelectField),
};

const formData = ref({});

const demoSchema = {
  type: 'object',
  properties: {
    // Basic info
    fullName: {
      type: 'string',
      title: 'Full Name',
      minLength: 2,
      description: 'Your first and last name'
    },
    
    // Format fields
    email: {
      type: 'string',
      format: 'email',
      title: 'Email Address',
      description: 'We\'ll use this to contact you'
    },
    
    password: {
      type: 'string',
      format: 'password',
      title: 'Password',
      description: 'Choose a secure password',
      minLength: 8
    },
    
    birthDate: {
      type: 'string',
      format: 'date',
      title: 'Birth Date',
      description: 'When were you born?'
    },
    
    website: {
      type: 'string',
      format: 'url',
      title: 'Personal Website',
      description: 'Your portfolio, blog, or personal site'
    },
    
    phone: {
      type: 'string',
      format: 'tel',
      title: 'Phone Number',
      description: 'Your primary contact number'
    },
    
    country: {
      type: 'string',
      title: 'Country',
      enum: ['United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Australia', 'Japan', 'Brazil', 'India', 'Other'],
      description: 'Where are you located?'
    },
    
    // Optional fields
    linkedIn: {
      type: 'string',
      format: 'url',
      title: 'LinkedIn Profile',
      description: 'Your professional profile (optional)'
    },
    
    emergencyContact: {
      type: 'string',
      format: 'tel',
      title: 'Emergency Contact',
      description: 'Phone number of someone we can contact if needed'
    }
  },
  required: ['fullName', 'email', 'password', 'birthDate', 'phone', 'country']
};

const supportedFormats = [
  {
    name: 'email',
    type: 'FormattedField',
    description: 'Email input with validation and domain suggestions',
    example: 'user@example.com'
  },
  {
    name: 'password',
    type: 'PasswordField',
    description: 'Password field with strength indicator and show/hide toggle',
    example: 'SecurePass123!'
  },
  {
    name: 'date',
    type: 'DateField',
    description: 'Date picker with quick options and relative dates',
    example: '2024-01-15'
  },
  {
    name: 'url/uri',
    type: 'FormattedField',
    description: 'URL input with protocol helper and preview',
    example: 'https://example.com'
  },
  {
    name: 'tel/phone',
    type: 'FormattedField',
    description: 'Phone number input with formatting and validation',
    example: '+1 (555) 123-4567'
  },
  {
    name: 'time',
    type: 'TextField',
    description: 'Time input with HH:MM format validation',
    example: '14:30'
  },
  {
    name: 'date-time',
    type: 'DateField',
    description: 'Date and time input for timestamps',
    example: '2024-01-15T14:30:00Z'
  },
  {
    name: 'uuid',
    type: 'TextField',
    description: 'UUID input with format validation',
    example: '123e4567-e89b-12d3-a456-426614174000'
  }
];

const validExamples = [
  { format: 'email', value: 'user@example.com' },
  { format: 'url', value: 'https://www.example.com/path?query=1' },
  { format: 'date', value: '2024-01-15' },
  { format: 'tel', value: '+1 (555) 123-4567' },
  { format: 'time', value: '14:30' },
  { format: 'uuid', value: '123e4567-e89b-12d3-a456-426614174000' },
];

const invalidExamples = [
  { format: 'email', value: 'invalid-email', error: 'Missing @ symbol and domain' },
  { format: 'url', value: 'not-a-url', error: 'Missing protocol (http/https)' },
  { format: 'date', value: '2024-13-45', error: 'Invalid month and day' },
  { format: 'tel', value: 'abc-def-ghij', error: 'Contains non-numeric characters' },
  { format: 'time', value: '25:70', error: 'Invalid hour and minute' },
  { format: 'uuid', value: '123-456-789', error: 'Incorrect UUID format' },
];

const getFieldType = (fieldKey: string) => {
  const field = demoSchema.properties[fieldKey as keyof typeof demoSchema.properties];
  if (!field) return 'unknown';
  
  if (field.enum) return 'select';
  if (field.format) {
    // Unified format handling
    if (['email', 'url', 'tel', 'phone'].includes(field.format)) {
      return 'formattedfield';
    }
    return `${field.format}field`;
  }
  return `${field.type}field`;
};
</script>