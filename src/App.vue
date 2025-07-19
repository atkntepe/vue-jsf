<template>
  <div
    class="h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex flex-col md:overflow-hidden"
  >
    <div
      class="border-b border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm flex-shrink-0"
    >
      <div class="px-6 py-4 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-slate-900 dark:text-slate-50">
            Vue-JSF
          </h1>
          <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Interactive form builder with real-time JSON output
          </p>
        </div>

        <button
          @click="toggleDarkMode"
          class="p-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          title="Toggle dark mode"
        >
          <svg
            v-if="isDarkMode"
            class="h-5 w-5 text-slate-900 dark:text-slate-100"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>

          <svg
            v-else
            class="h-5 w-5 text-slate-900 dark:text-slate-100"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        </button>
      </div>
    </div>

    <div class="flex flex-1 md:overflow-hidden md:flex-row flex-col">
      <div
        class="w-full md:w-1/2 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col"
      >
        <div
          class="border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex-shrink-0 h-[91px]"
        >
          <div class="flex items-center gap-2">
            <div class="h-2 w-2 rounded-full bg-blue-500"></div>
            <h2 class="text-lg font-medium text-slate-900 dark:text-slate-100">
              Form Builder
            </h2>
          </div>
          <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Configure and test your JSON schema form
          </p>
        </div>

        <div class="flex-1 overflow-y-auto p-6">
          <div class="space-y-3 mb-6">
            <div
              class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400"
            >
              <div class="h-1.5 w-1.5 rounded-full bg-green-500"></div>
              <span>Schema validation active</span>
            </div>
            <div
              class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400"
            >
              <div class="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
              <span>Real-time JSON output</span>
            </div>
            <div
              class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400"
            >
              <div class="h-1.5 w-1.5 rounded-full bg-purple-500"></div>
              <span>Interactive field validation</span>
            </div>
          </div>

          <div
            class="rounded-lg border border-slate-200 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-900/50"
          >
            <SchemaForm
              :schema="testSchema"
              v-model="formData"
              :registry="testRegistry"
            />
          </div>
        </div>
      </div>

      <div class="w-full md:w-1/2 bg-white dark:bg-slate-950 flex flex-col">
        <div
          class="border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex-shrink-0 h-[91px]"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="h-2 w-2 rounded-full bg-emerald-500"></div>
              <h2
                class="text-lg font-medium text-slate-900 dark:text-slate-100"
              >
                JSON Output
              </h2>
            </div>
            <button
              @click="copyToClipboard"
              class="inline-flex items-center gap-2 px-3 py-1.5 text-sm border border-slate-200 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-900 dark:text-slate-50"
              title="Copy JSON to clipboard"
            >
              <svg
                class="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                ></path>
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

          <div
            class="rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden"
          >
            <div
              class="border-b border-slate-200 dark:border-slate-800 px-4 py-2 bg-slate-50 dark:bg-slate-900"
            >
              <div
                class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400"
              >
                <svg
                  class="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  ></path>
                </svg>
                formData.json
              </div>
            </div>

            <div
              v-if="Object.keys(formData).length"
              class="p-4 bg-slate-50/50 dark:bg-slate-900/50"
            >
              <pre
                class="text-sm text-slate-900 dark:text-slate-100 font-mono leading-relaxed whitespace-pre-wrap overflow-x-auto"
              ><code>{{ formattedJson }}</code></pre>
            </div>

            <div
              v-else
              class="p-12 text-center bg-slate-50/50 dark:bg-slate-900/50"
            >
              <div class="max-w-sm mx-auto">
                <svg
                  class="h-12 w-12 mx-auto text-slate-400 dark:text-slate-600 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  ></path>
                </svg>
                <h3
                  class="text-sm font-medium text-slate-900 dark:text-slate-100 mb-2"
                >
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
import { SchemaForm } from "./index.ts";
import TextField from "./components/TextField.vue";
import NumberField from "./components/NumberField.vue";

const testRegistry = {
  textfield: markRaw(TextField),
  numberfield: markRaw(NumberField),
};

const testSchema = {
  type: "object",
  properties: {
    name: { type: "string", title: "Your Name", minLength: 3 },
    age: { type: "number", minimum: 18 },
    skills: {
      type: "array",
      title: "Skills",
      description: "List your skills",
      items: { type: "string", title: "Skill" },
      minItems: 1,
      maxItems: 5,
    },
    hobbies: {
      type: "array",
      title: "Hobbies",
      items: { type: "string", title: "Hobby", maxLength: 20 },
    },
    contacts: {
      type: "array",
      title: "Emergency Contacts",
      items: {
        type: "object",
        properties: {
          name: { type: "string", title: "Contact Name" },
          phone: { type: "string", title: "Phone Number" },
          relationship: {
            type: "string",
            title: "Relationship",
            enum: ["family", "friend", "colleague"],
          },
        },
        required: ["name", "phone"],
      },
      minItems: 1,
      maxItems: 3,
    },
  },
  required: ["name", "age", "skills"],
};

const formData = ref({});
const isDarkMode = ref(false);

const formattedJson = computed(() => {
  return JSON.stringify(formData.value, null, 2);
});

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(formattedJson.value);
  } catch (err) {
    console.error("Failed to copy: ", err);
  }
};

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  updateDarkMode();
};

const updateDarkMode = () => {
  if (isDarkMode.value) {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
};

onMounted(() => {
  // Check for saved theme preference or default to system preference
  const savedTheme = localStorage.getItem("theme");
  const systemPreference = window.matchMedia(
    "(prefers-color-scheme: dark)",
  ).matches;

  if (savedTheme === "dark" || (!savedTheme && systemPreference)) {
    isDarkMode.value = true;
  }

  updateDarkMode();
});
</script>
