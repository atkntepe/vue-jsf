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
    
    <slot name="input" :value="localValue" :update="(val: any) => localValue = val" :field="field">
      <input
        v-if="field.widget !== 'textarea'"
        :id="field.path"
        v-model="localValue"
        :type="getInputType()"
        :class="[
          'flex h-10 w-full rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50',
          field.classNames,
          field.hidden ? 'hidden' : ''
        ]"
        :style="field.style"
        :placeholder="field.placeholder || field.description"
        :disabled="field.disabled"
        :readonly="field.readonly"
        :autocomplete="field.ui?.['ui:autocomplete']"
        :autofocus="field.ui?.['ui:autofocus']"
      />
      <textarea
        v-else
        :id="field.path"
        v-model="localValue"
        :class="[
          'flex min-h-[80px] w-full rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 resize-y',
          field.classNames,
          field.hidden ? 'hidden' : ''
        ]"
        :style="field.style"
        :placeholder="field.placeholder || field.description"
        :disabled="field.disabled"
        :readonly="field.readonly"
        :rows="field.ui?.['ui:options']?.rows || 4"
        :cols="field.ui?.['ui:options']?.cols"
      />
    </slot>

    <div v-if="field.help" class="text-xs text-slate-600 dark:text-slate-400">
      {{ field.help }}
    </div>
    
    <slot name="errors" :errors="errors">
      <div v-if="errors.length" class="text-sm text-red-500 dark:text-red-400">
        {{ errors[0].$message }}
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { FieldWithUI } from "../types";

const props = defineProps<{ field: FieldWithUI; modelValue: any; errors: any[] }>();

const emit = defineEmits(["update:modelValue"]);

const localValue = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const getInputType = () => {
  if (props.field.widget === 'hidden') return 'hidden';
  if (props.field.format === 'email') return 'email';
  if (props.field.format === 'url' || props.field.format === 'uri') return 'url';
  if (props.field.format === 'tel' || props.field.format === 'phone') return 'tel';
  if (props.field.format === 'date') return 'date';
  if (props.field.format === 'time') return 'time';
  if (props.field.format === 'datetime' || props.field.format === 'date-time') return 'datetime-local';
  if (props.field.format === 'password') return 'password';
  return 'text';
};
</script>
