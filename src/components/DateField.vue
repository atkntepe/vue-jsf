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
      <div class="relative">
        <input
          :id="field.path"
          v-model="localValue"
          type="date"
          ref="dateInput"
          class="flex h-10 w-full rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 pl-10 pr-16 py-2 text-sm text-slate-900 dark:text-slate-50 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden [&::-webkit-clear-button]:hidden"
          :placeholder="field.description || 'Select date'"
          :min="minDate"
          :max="maxDate"
          :class="{
            'border-red-300 dark:border-red-700 focus:ring-red-500 dark:focus:ring-red-400':
              errors.length > 0,
            'border-green-300 dark:border-green-700': isValidDate && localValue,
          }"
        />

        <button
          type="button"
          @click="openDatePicker"
          class="absolute right-2 top-1/2 transform -translate-y-1/2 px-2 py-1 text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1"
          :aria-label="'Open calendar'"
        >
          <svg
            class="h-3 w-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </button>

        <div class="absolute left-3 top-1/2 transform -translate-y-1/2">
          <svg
            class="h-4 w-4"
            :class="{
              'text-red-500': errors.length > 0,
              'text-green-500': isValidDate && localValue,
              'text-slate-400 dark:text-slate-500':
                !errors.length && (!localValue || !isValidDate),
            }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      </div>
    </slot>

    <div v-if="showQuickOptions" class="flex flex-wrap gap-2">
      <button
        v-for="option in quickDateOptions"
        :key="option.label"
        @click="localValue = option.value"
        type="button"
        class="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded transition-colors"
      >
        {{ option.label }}
      </button>
    </div>

    <div
      v-if="localValue && isValidDate"
      class="text-xs text-slate-600 dark:text-slate-400"
    >
      <div class="flex items-center gap-4">
        <span>{{ formattedDate }}</span>
        <span v-if="relativeDate">{{ relativeDate }}</span>
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
import { computed, ref } from "vue";
import type { Field } from "../composables/useSchemaParser";

const props = defineProps<{ field: Field; modelValue: any; errors: any[] }>();
const emit = defineEmits(["update:modelValue"]);

const showQuickOptions = ref(true);
const dateInput = ref<HTMLInputElement>();

const openDatePicker = () => {
  if (dateInput.value) {
    dateInput.value.showPicker?.();
  }
};

const localValue = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const isValidDate = computed(() => {
  if (!localValue.value) return false;
  const date = new Date(localValue.value);
  return !isNaN(date.getTime());
});

const minDate = computed(() => {
  return undefined;
});

const maxDate = computed(() => {
  return undefined;
});

const formattedDate = computed(() => {
  if (!isValidDate.value) return "";
  const date = new Date(localValue.value);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

const relativeDate = computed(() => {
  if (!isValidDate.value) return "";

  const date = new Date(localValue.value);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const dateStr = date.toDateString();
  const todayStr = today.toDateString();
  const tomorrowStr = tomorrow.toDateString();
  const yesterdayStr = yesterday.toDateString();

  if (dateStr === todayStr) return "(Today)";
  if (dateStr === tomorrowStr) return "(Tomorrow)";
  if (dateStr === yesterdayStr) return "(Yesterday)";

  const diffTime = date.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > 0 && diffDays <= 7) {
    return `(In ${diffDays} day${diffDays > 1 ? "s" : ""})`;
  } else if (diffDays < 0 && diffDays >= -7) {
    return `(${Math.abs(diffDays)} day${Math.abs(diffDays) > 1 ? "s" : ""} ago)`;
  }

  return "";
});

const quickDateOptions = computed(() => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  const nextMonth = new Date(today);
  nextMonth.setMonth(today.getMonth() + 1);

  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  return [
    { label: "Today", value: formatDate(today) },
    { label: "Tomorrow", value: formatDate(tomorrow) },
    { label: "Next Week", value: formatDate(nextWeek) },
    { label: "Next Month", value: formatDate(nextMonth) },
  ];
});
</script>

