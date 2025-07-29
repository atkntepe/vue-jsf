<template>
  <div class="min-h-screen flex flex-col">
    <!-- Page Header -->
    <div class="border-b border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="text-center">
          <h1 class="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2">
            UI Schema Demo
          </h1>
          <p class="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Explore UI Schema capabilities to customize form appearance and behavior beyond basic JSON Schema.
          </p>
        </div>
      </div>
    </div>

    <!-- Demo Content -->
    <div class="flex-1 flex flex-col lg:flex-row lg:overflow-hidden">
      <!-- Schema Configuration Panel -->
      <div class="w-full lg:w-1/2 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col">
        <div class="border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex-shrink-0">
          <div class="flex items-center gap-2">
            <div class="h-2 w-2 rounded-full bg-purple-500"></div>
            <h2 class="text-lg font-medium text-slate-900 dark:text-slate-100">
              Schema Configuration
            </h2>
          </div>
          <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Customize your form using UI Schema
          </p>
        </div>

        <div class="flex-1 overflow-y-auto p-6 space-y-6">
          <!-- Example Selection -->
          <div class="space-y-3">
      
            <SelectField
              :field="exampleSelectField"
              v-model="selectedExample"
              @update:modelValue="loadExample"
              :errors="[]"
            />
          </div>

          <!-- JSON Schema Input -->
          <div class="space-y-3">
            <label class="text-sm font-medium text-slate-900 dark:text-slate-100">
              JSON Schema
            </label>
            <textarea
              v-model="jsonSchemaInput"
              rows="8"
              class="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-md bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-mono text-sm"
              placeholder="Enter JSON Schema..."
            />
          </div>

          <!-- UI Schema Input -->
          <div class="space-y-3">
            <label class="text-sm font-medium text-slate-900 dark:text-slate-100">
              UI Schema
            </label>
            <textarea
              v-model="uiSchemaInput"
              rows="10"
              class="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-md bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-mono text-sm"
              placeholder="Enter UI Schema..."
            />
          </div>

          <!-- Update Button -->
          <button
            @click="updateForm"
            class="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1"
          >
            Update Form
          </button>
        </div>
      </div>

      <!-- Form Demo Panel -->
      <div class="w-full lg:w-1/2 bg-slate-50 dark:bg-slate-900 flex flex-col">
        <div class="border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex-shrink-0">
          <div class="flex items-center gap-2">
            <div class="h-2 w-2 rounded-full bg-emerald-500"></div>
            <h2 class="text-lg font-medium text-slate-900 dark:text-slate-100">
              Generated Form
            </h2>
          </div>
          <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">
            See your UI Schema customizations in action
          </p>
        </div>

        <div class="flex-1 overflow-y-auto p-6">
          <!-- Form Display -->
          <div
            v-if="currentSchema && currentUISchema"
            class="bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 p-6"
          >
            <SchemaForm
              :schema="currentSchema"
              :ui-schema="currentUISchema"
              v-model="formData"
              :key="formKey"
            />
          </div>

          <!-- No Schema State -->
          <div
            v-else
            class="bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 p-8 text-center"
          >
            <svg class="h-12 w-12 mx-auto text-slate-400 dark:text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <h3 class="text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">
              No Form Available
            </h3>
            <p class="text-sm text-slate-500 dark:text-slate-400">
              Select an example or enter valid schemas to see the form
            </p>
          </div>

          <!-- Form Data Preview -->
          <div
            v-if="Object.keys(formData).length > 0"
            class="mt-6 bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 p-4"
          >
            <h3 class="text-sm font-medium text-slate-900 dark:text-slate-100 mb-3">
              Form Data
            </h3>
            <pre class="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 p-3 rounded border overflow-x-auto">{{ JSON.stringify(formData, null, 2) }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { SchemaForm } from '../index';
import SelectField from '../components/SelectField.vue';

const selectedExample = ref('basic');
const jsonSchemaInput = ref('');
const uiSchemaInput = ref('');
const currentSchema = ref(null);
const currentUISchema = ref(null);
const formData = reactive({});
const formKey = ref(0);

const examples: Record<string, any> = {
  basic: {
    title: 'Basic UI Customization',
    jsonSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          title: 'Full Name'
        },
        email: {
          type: 'string',
          format: 'email',
          title: 'Email Address'
        },
        bio: {
          type: 'string',
          title: 'Biography'
        },
        age: {
          type: 'integer',
          title: 'Age',
          minimum: 0,
          maximum: 120
        }
      },
      required: ['name', 'email']
    },
    uiSchema: {
      name: {
        'ui:placeholder': 'Enter your full name',
        'ui:help': 'This will be displayed publicly'
      },
      email: {
        'ui:placeholder': 'your.email@example.com',
        'ui:help': 'We will never share your email'
      },
      bio: {
        'ui:widget': 'textarea',
        'ui:placeholder': 'Tell us about yourself...',
        'ui:options': {
          rows: 6
        }
      },
      age: {
        'ui:widget': 'range',
        'ui:help': 'Use the slider to select your age'
      },
      'ui:order': ['name', 'email', 'age', 'bio']
    }
  },
  widgets: {
    title: 'Widget Showcase',
    jsonSchema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          title: 'Title'
        },
        description: {
          type: 'string',
          title: 'Description'
        },
        category: {
          type: 'string',
          enum: ['tech', 'design', 'business', 'other'],
          title: 'Category'
        },
        priority: {
          type: 'string',
          enum: ['low', 'medium', 'high', 'urgent'],
          title: 'Priority'
        },
        isPublic: {
          type: 'boolean',
          title: 'Make Public'
        },
        tags: {
          type: 'array',
          items: {
            type: 'string'
          },
          title: 'Tags'
        }
      },
      required: ['title', 'category']
    },
    uiSchema: {
      title: {
        'ui:placeholder': 'Enter a descriptive title',
        'ui:autofocus': true
      },
      description: {
        'ui:widget': 'textarea',
        'ui:placeholder': 'Provide detailed description...',
        'ui:options': {
          rows: 4
        }
      },
      category: {
        'ui:widget': 'radio',
        'ui:help': 'Select the most appropriate category'
      },
      priority: {
        'ui:enumNames': ['Low Priority', 'Medium Priority', 'High Priority', 'Urgent!'],
        'ui:help': 'Choose priority level'
      },
      isPublic: {
        'ui:help': 'Check this to make your item visible to others'
      },
      'ui:order': ['title', 'description', 'category', 'priority', 'isPublic', 'tags']
    }
  },
  styling: {
    title: 'Custom Styling',
    jsonSchema: {
      type: 'object',
      properties: {
        firstName: {
          type: 'string',
          title: 'First Name'
        },
        lastName: {
          type: 'string',
          title: 'Last Name'
        },
        password: {
          type: 'string',
          format: 'password',
          title: 'Password'
        },
        confirmPassword: {
          type: 'string',
          format: 'password',
          title: 'Confirm Password'
        }
      },
      required: ['firstName', 'lastName', 'password']
    },
    uiSchema: {
      firstName: {
        'ui:placeholder': 'John',
        'ui:classNames': 'border-green-300 focus:border-green-500 focus:ring-green-500'
      },
      lastName: {
        'ui:placeholder': 'Doe',
        'ui:classNames': 'border-green-300 focus:border-green-500 focus:ring-green-500'
      },
      password: {
        'ui:help': 'Must be at least 8 characters long',
        'ui:classNames': 'border-red-300 focus:border-red-500 focus:ring-red-500'
      },
      confirmPassword: {
        'ui:help': 'Re-enter your password to confirm',
        'ui:classNames': 'border-red-300 focus:border-red-500 focus:ring-red-500'
      }
    }
  }
};

// Create a field configuration for the example selector
const exampleSelectField = computed(() => ({
  key: 'example',
  path: 'example',
  type: 'select',
  label: 'Choose Example',
  description: 'Select a predefined example to get started',
  required: false,
  enum: Object.entries(examples).map(([key, example]) => ({
    value: key,
    label: example.title
  })),
  default: 'basic',
  rules: []
}));

const loadExample = () => {
  const example = examples[selectedExample.value];
  if (example) {
    jsonSchemaInput.value = JSON.stringify(example.jsonSchema, null, 2);
    uiSchemaInput.value = JSON.stringify(example.uiSchema, null, 2);
    updateForm();
  }
};

const updateForm = () => {
  try {
    currentSchema.value = JSON.parse(jsonSchemaInput.value);
    currentUISchema.value = JSON.parse(uiSchemaInput.value || '{}');
    
    // Clear form data and force re-render
    Object.keys(formData).forEach(key => delete (formData as any)[key]);
    formKey.value++;
  } catch (error) {
    console.error('Invalid JSON:', error);
    currentSchema.value = null;
    currentUISchema.value = null;
  }
};

// Load initial example
loadExample();
</script>