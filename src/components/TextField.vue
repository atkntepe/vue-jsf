<template>
  <div class="space-y-2 mb-6">
    <label
      :for="field.path"
      class="text-sm font-medium text-slate-900 dark:text-slate-100"
    >
      {{ field.label }}
      <span v-if="field.required" class="text-red-500 ml-1">*</span>
    </label>
    <input
      :id="field.path"
      v-model="localValue"
      type="text"
      class="flex h-10 w-full rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
      :placeholder="field.description"
    />
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
