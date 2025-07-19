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
      <div class="relative" ref="passwordContainer">
        <input
          :id="field.path"
          v-model="localValue"
          :type="showPassword ? 'text' : 'password'"
          class="flex h-10 w-full rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 pl-10 pr-12 py-2 text-sm text-slate-900 dark:text-slate-50 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
          :placeholder="field.description || 'Enter password'"
          autocomplete="current-password"
          @focus="showStrengthPopup = true"
          @input="showStrengthPopup = true"
          @blur="handleBlur"
          :class="{
            'border-red-300 dark:border-red-700 focus:ring-red-500 dark:focus:ring-red-400':
              errors.length > 0,
            'border-green-300 dark:border-green-700':
              passwordStrength.score >= 3 && localValue,
          }"
        />

        <div class="absolute left-3 top-1/2 transform -translate-y-1/2">
          <svg
            class="h-4 w-4"
            :class="{
              'text-red-500': errors.length > 0,
              'text-green-500': passwordStrength.score >= 3 && localValue,
              'text-slate-400 dark:text-slate-500':
                !errors.length && (!localValue || passwordStrength.score < 3),
            }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>

        <button
          type="button"
          @click="showPassword = !showPassword"
          class="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          :aria-label="showPassword ? 'Hide password' : 'Show password'"
        >
          <svg
            v-if="showPassword"
            class="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
            />
          </svg>
          <svg
            v-else
            class="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        </button>
      </div>
    </slot>

    <div v-if="localValue && showStrengthPopup" class="relative">
      <div
        class="absolute top-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg p-4 space-y-3"
      >
        <div class="flex items-center gap-2">
          <span class="text-xs text-slate-600 dark:text-slate-400"
            >Strength:</span
          >
          <div class="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
            <div
              class="h-full rounded-full transition-all duration-300"
              :class="passwordStrength.color"
              :style="{ width: `${(passwordStrength.score / 4) * 100}%` }"
            ></div>
          </div>
          <span class="text-xs font-medium" :class="passwordStrength.textColor">
            {{ passwordStrength.label }}
          </span>
        </div>

        <div class="text-xs space-y-1">
          <div
            v-for="requirement in passwordRequirements"
            :key="requirement.label"
            class="flex items-center gap-2"
          >
            <svg
              class="h-3 w-3"
              :class="
                requirement.met
                  ? 'text-green-500'
                  : 'text-slate-400 dark:text-slate-500'
              "
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
            <span
              :class="
                requirement.met
                  ? 'text-slate-900 dark:text-slate-100'
                  : 'text-slate-500 dark:text-slate-400'
              "
            >
              {{ requirement.label }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <slot name="errors" :errors="errors">
      <div v-if="errors.length" class="text-sm text-red-500 dark:text-red-400">
        {{ errors[0].$message }}
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted } from "vue";
import type { Field } from "../composables/useSchemaParser";

const props = defineProps<{ field: Field; modelValue: any; errors: any[] }>();
const emit = defineEmits(["update:modelValue"]);

const showPassword = ref(false);
const showStrengthPopup = ref(false);
const passwordContainer = ref<HTMLElement>();

const handleBlur = () => {
  setTimeout(() => {
    showStrengthPopup.value = false;
  }, 150);
};

const handleClickOutside = (event: Event) => {
  if (
    passwordContainer.value &&
    !passwordContainer.value.contains(event.target as Node)
  ) {
    showStrengthPopup.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

const localValue = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const passwordRequirements = computed(() => {
  const password = localValue.value || "";
  return [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Contains lowercase letter", met: /[a-z]/.test(password) },
    { label: "Contains number", met: /\d/.test(password) },
    {
      label: "Contains special character",
      met: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    },
  ];
});

const passwordStrength = computed(() => {
  const password = localValue.value || "";
  if (!password) return { score: 0, label: "", color: "", textColor: "" };

  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;

  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

  if (/(.)\1{2,}/.test(password)) score--;
  if (/123|abc|qwe/i.test(password)) score--;

  score = Math.max(0, Math.min(4, score));

  const strengthMap = {
    0: {
      label: "Very Weak",
      color: "bg-red-500",
      textColor: "text-red-600 dark:text-red-400",
    },
    1: {
      label: "Weak",
      color: "bg-red-400",
      textColor: "text-red-600 dark:text-red-400",
    },
    2: {
      label: "Fair",
      color: "bg-yellow-400",
      textColor: "text-yellow-600 dark:text-yellow-400",
    },
    3: {
      label: "Good",
      color: "bg-blue-500",
      textColor: "text-blue-600 dark:text-blue-400",
    },
    4: {
      label: "Strong",
      color: "bg-green-500",
      textColor: "text-green-600 dark:text-green-400",
    },
  };

  return { score, ...strengthMap[score as keyof typeof strengthMap] };
});

watch(localValue, (newValue) => {
  if (!newValue) {
    showStrengthPopup.value = false;
  }
});
</script>
