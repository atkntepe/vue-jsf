<template>
  <div class="space-y-2 mb-6">
    <div class="flex items-center space-x-2">
      <input
        :id="field.path"
        v-model="localValue"
        type="checkbox"
        class="h-4 w-4 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-0"
      />
      <label :for="field.path" class="text-sm font-medium text-slate-900 dark:text-slate-100 cursor-pointer">
        {{ field.label }}
        <span v-if="field.required" class="text-red-500 ml-1">*</span>
      </label>
    </div>
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
  get: () => !!props.modelValue,
  set: (val) => emit("update:modelValue", val),
});
</script>
