<template>
  <div class="min-h-screen flex flex-col">
    <!-- Page Header -->
    <div class="border-b border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="text-center">
          <h1 class="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2">
            Interactive Playground
          </h1>
          <p class="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Test and experiment with JSON Schema forms in real-time. Build your schemas and see the forms generate instantly.
          </p>
        </div>
      </div>
    </div>

    <!-- Playground Content -->
    <div class="flex-1 flex flex-col md:flex-row md:overflow-hidden">
      <!-- Schema Builder Panel -->
      <div class="w-full md:w-1/2 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col">
        <div class="border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex-shrink-0">
          <div class="flex items-center gap-2">
            <div class="h-2 w-2 rounded-full bg-blue-500"></div>
            <h2 class="text-lg font-medium text-slate-900 dark:text-slate-100">
              Schema Builder
            </h2>
          </div>
          <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Configure and test your JSON schema form
          </p>
        </div>

        <div class="flex-1 overflow-y-auto p-6">
          <div class="space-y-4 mb-6">
            <!-- Schema Input Section -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <label class="text-sm font-medium text-slate-900 dark:text-slate-100">
                  JSON Schema Input
                </label>
                <button
                  @click="parseSchema"
                  class="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                >
                  Generate Form
                </button>
              </div>
              <textarea
                v-model="schemaInput"
                placeholder="Paste your JSON schema here..."
                class="w-full h-32 px-3 py-2 text-sm font-mono rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              ></textarea>
              
              <!-- Status indicators -->
              <div class="flex items-center gap-4 text-xs">
                <div class="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <div :class="schemaValid ? 'bg-green-500' : 'bg-red-500'" class="h-1.5 w-1.5 rounded-full"></div>
                  <span>{{ schemaValid ? 'Valid schema' : 'Invalid schema' }}</span>
                </div>
                <div class="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <div class="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                  <span>Real-time parsing</span>
                </div>
                <div class="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <div class="h-1.5 w-1.5 rounded-full bg-purple-500"></div>
                  <span>Auto-persist</span>
                </div>
              </div>

              <!-- Error message -->
              <div
                v-if="schemaError"
                class="p-3 rounded-md bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800"
              >
                <div class="flex items-start gap-2">
                  <svg class="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div>
                    <p class="text-sm font-medium text-red-800 dark:text-red-200">Schema Error</p>
                    <p class="text-sm text-red-600 dark:text-red-300 mt-1">{{ schemaError }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Example Schemas -->
            <div class="space-y-3">
              <label class="text-sm font-medium text-slate-900 dark:text-slate-100">
                Quick Examples
              </label>
              <div class="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                <button
                  v-for="example in sampleSchemas"
                  :key="example.name"
                  @click="loadExample(example)"
                  class="px-3 py-2 text-xs text-left bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors border border-slate-200 dark:border-slate-700"
                >
                  <div class="font-medium text-slate-900 dark:text-slate-100">{{ example.name }}</div>
                  <div class="text-slate-600 dark:text-slate-400 mt-1">{{ example.description }}</div>
                </button>
              </div>
            </div>
          </div>

          <!-- Generated Form -->
          <div
            v-if="currentSchema"
            class="rounded-lg border border-slate-200 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-900/50"
          >
            <div class="mb-4">
              <h3 class="text-sm font-medium text-slate-900 dark:text-slate-100 mb-1">Generated Form</h3>
              <p class="text-xs text-slate-600 dark:text-slate-400">Interactive form based on your schema</p>
            </div>
            <SchemaForm
              :schema="currentSchema"
              v-model="formData"
              :registry="testRegistry"
              :key="schemaKey"
            />
          </div>

          <!-- No schema state -->
          <div
            v-else
            class="rounded-lg border border-slate-200 dark:border-slate-800 p-8 bg-slate-50/50 dark:bg-slate-900/50 text-center"
          >
            <svg class="h-12 w-12 mx-auto text-slate-400 dark:text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <h3 class="text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">
              No valid schema
            </h3>
            <p class="text-sm text-slate-500 dark:text-slate-400">
              Enter a valid JSON schema above to generate a form
            </p>
          </div>
        </div>
      </div>

      <!-- JSON Output Panel -->
      <div class="w-full md:w-1/2 bg-white dark:bg-slate-950 flex flex-col">
        <div class="border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex-shrink-0">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="h-2 w-2 rounded-full bg-emerald-500"></div>
              <h2 class="text-lg font-medium text-slate-900 dark:text-slate-100">
                JSON Output
              </h2>
            </div>
            <button
              @click="copyToClipboard"
              class="inline-flex items-center gap-2 px-3 py-1.5 text-sm border border-slate-200 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-900 dark:text-slate-50"
              title="Copy JSON to clipboard"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
              Copy
            </button>
          </div>
          <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Live preview of form data
          </p>
        </div>

        <div class="flex-1 overflow-y-auto p-6">
          <div class="space-y-2 mb-6">
            <div class="flex items-center justify-between text-sm">
              <span class="text-slate-600 dark:text-slate-400">Fields</span>
              <span class="font-medium text-slate-900 dark:text-slate-100">{{
                Object.keys(formData).length
              }}</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-slate-600 dark:text-slate-400">Status</span>
              <span class="inline-flex items-center gap-1.5">
                <div
                  :class="
                    Object.keys(formData).length
                      ? 'bg-green-500'
                      : 'bg-slate-400'
                  "
                  class="h-1.5 w-1.5 rounded-full"
                ></div>
                <span class="text-slate-900 dark:text-slate-100 font-medium">
                  {{ Object.keys(formData).length ? "Active" : "Waiting" }}
                </span>
              </span>
            </div>
          </div>

          <div class="rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div class="border-b border-slate-200 dark:border-slate-800 px-4 py-2 bg-slate-50 dark:bg-slate-900">
              <div class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                formData.json
              </div>
            </div>

            <div
              v-if="Object.keys(formData).length"
              class="p-4 bg-slate-50/50 dark:bg-slate-900/50"
            >
              <pre class="text-sm text-slate-900 dark:text-slate-100 font-mono leading-relaxed whitespace-pre-wrap overflow-x-auto"><code>{{ formattedJson }}</code></pre>
            </div>

            <div
              v-else
              class="p-12 text-center bg-slate-50/50 dark:bg-slate-900/50"
            >
              <div class="max-w-sm mx-auto">
                <svg class="h-12 w-12 mx-auto text-slate-400 dark:text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <h3 class="text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">
                  No form data yet
                </h3>
                <p class="text-sm text-slate-500 dark:text-slate-400">
                  Start filling out the form to see the JSON output here
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, markRaw, computed, onMounted } from "vue";
import { SchemaForm } from "../index.ts";
import TextField from "../components/TextField.vue";
import NumberField from "../components/NumberField.vue";
import SelectField from "../components/SelectField.vue";
import FileUpload from "../components/FileUpload.vue";
import { sampleSchemas } from "../samples/index.js";

const testRegistry = {
  textfield: markRaw(TextField),
  numberfield: markRaw(NumberField),
  select: markRaw(SelectField),
  fileupload: markRaw(FileUpload),
};

const testSchema = {
  type: "object",
  properties: {
    name: { type: "string", title: "Your Name", minLength: 3 },
    age: { type: "number", title: "Age", minimum: 18 },
    email: {
      type: "string",
      format: "email",
      title: "Email Address",
      description: "Your email address",
    },
    password: {
      type: "string",
      format: "password",
      title: "Password",
      description: "Create a secure password",
      minLength: 8,
    },
    birthdate: {
      type: "string",
      format: "date",
      title: "Birth Date",
      description: "Select your birth date",
    },
    website: {
      type: "string",
      format: "url",
      title: "Personal Website",
      description: "Your website or portfolio URL",
    },
    phone: {
      type: "string",
      format: "tel",
      title: "Phone Number",
      description: "Your contact phone number",
    },
    country: {
      type: "string",
      title: "Country",
      enum: [
        "United States",
        "Canada",
        "United Kingdom",
        "Germany",
        "France",
        "Australia",
        "Japan",
        "Other",
      ],
      description: "Select your country",
    },
    avatar: {
      type: "string",
      format: "file",
      title: "Profile Picture",
      description: "Upload your profile picture",
      accept: "image/*",
      maxSize: 5242880
    },
    resume: {
      type: "string",
      format: "file",
      title: "Resume/CV",
      description: "Upload your resume",
      accept: ".pdf,.doc,.docx",
      maxSize: 10485760
    },
    portfolio: {
      type: "array",
      title: "Portfolio Files",
      description: "Upload portfolio images or documents",
      items: {
        type: "string",
        format: "file",
        title: "Portfolio Item"
      },
      maxItems: 5,
      accept: "image/*,.pdf",
      maxSize: 10485760
    },
    skills: {
      type: "array",
      title: "Skills",
      description: "List your skills",
      items: { type: "string", title: "Skill" },
      minItems: 1,
      maxItems: 5,
    },
    socialLinks: {
      type: "array",
      title: "Social Media Links",
      description: "Add your social media profiles",
      items: {
        type: "string",
        format: "url",
        title: "Social Link",
        description: "URL to your social media profile",
      },
      maxItems: 3,
    },
    contacts: {
      type: "array",
      title: "Emergency Contacts",
      items: {
        type: "object",
        properties: {
          name: { type: "string", title: "Contact Name" },
          email: {
            type: "string",
            format: "email",
            title: "Email Address",
          },
          phone: {
            type: "string",
            format: "tel",
            title: "Phone Number",
          },
          relationship: {
            type: "string",
            title: "Relationship",
            enum: ["family", "friend", "colleague"],
          },
        },
        required: ["name"],
      },
      minItems: 1,
      maxItems: 3,
    },
  },
  required: ["name", "age", "email", "password"],
};

const formData = ref({});

// Schema input and parsing
const schemaInput = ref('');
const currentSchema = ref(null);
const schemaValid = ref(false);
const schemaError = ref('');
const schemaKey = ref(0); // Force re-render when schema changes

const formattedJson = computed(() => {
  return JSON.stringify(formData.value, null, 2);
});

// Parse schema with error handling and persistence
const parseSchema = () => {
  if (!schemaInput.value.trim()) {
    currentSchema.value = null;
    schemaValid.value = false;
    schemaError.value = '';
    formData.value = {};
    return;
  }

  try {
    const parsed = JSON.parse(schemaInput.value);
    
    // Basic schema validation
    if (typeof parsed !== 'object' || parsed === null) {
      throw new Error('Schema must be a valid JSON object');
    }
    
    if (!parsed.type) {
      throw new Error('Schema must have a "type" field');
    }
    
    if (parsed.type === 'object' && !parsed.properties) {
      throw new Error('Object schemas must have a "properties" field');
    }

    // Success - update state
    currentSchema.value = parsed;
    schemaValid.value = true;
    schemaError.value = '';
    formData.value = {}; // Reset form data for new schema
    schemaKey.value++; // Force component re-render
    
    // Persist to localStorage
    localStorage.setItem('vue-jsf-schema', schemaInput.value);
    
  } catch (error) {
    // Keep last valid schema, show error
    schemaValid.value = false;
    schemaError.value = error instanceof Error ? error.message : 'Invalid JSON format';
  }
};

// Load example schema
const loadExample = (example: any) => {
  schemaInput.value = JSON.stringify(example.schema, null, 2);
  parseSchema();
};

// Load schema from localStorage on mount
const loadPersistedSchema = () => {
  const saved = localStorage.getItem('vue-jsf-schema');
  if (saved) {
    schemaInput.value = saved;
    parseSchema();
  } else {
    // Use fallback schema for demo
    schemaInput.value = JSON.stringify(testSchema, null, 2);
    parseSchema();
  }
};

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(formattedJson.value);
  } catch (err) {
    console.error("Failed to copy: ", err);
  }
};

onMounted(() => {
  // Load persisted schema
  loadPersistedSchema();
});
</script>