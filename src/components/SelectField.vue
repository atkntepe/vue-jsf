<template>
  <div class="space-y-2 mb-6">
    <label
      :for="field.path"
      class="text-sm font-medium text-slate-900 dark:text-slate-100"
    >
      {{ field.label }}
      <span v-if="field.required" class="text-red-500 ml-1">*</span>
    </label>
    <select
      :id="field.path"
      v-model="localValue"
      class="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
    >
      <option value="" disabled class="text-slate-500 dark:text-slate-400">Select an option</option>
      <option 
        v-for="option in field.enum" 
        :key="option" 
        :value="option"
        class="text-slate-900 dark:text-slate-50"
      >
        {{ option }}
      </option>
    </select>
    <div v-if="errors.length" class="text-sm text-red-500 dark:text-red-400">
      {{ errors[0].$message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Field } from "../composables/useSchemaParser";

const props = defineProps<{ field: Field; modelValue: any; errors: any[] }>();
const emit = defineEmits(["update:modelValue"]);

const localValue = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});
</script>
