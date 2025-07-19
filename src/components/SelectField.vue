<template>
  <div class="mb-4">
    <label
      :for="field.path"
      class="block text-sm font-medium text-gray-300 mb-1"
    >
      {{ field.label }}
      <span v-if="field.required" class="text-red-500">*</span>
    </label>
    <select
      :id="field.path"
      v-model="localValue"
      class="w-full p-2 bg-zinc-700 text-white rounded-md border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="" disabled>Select an option</option>
      <option v-for="option in field.enum" :key="option" :value="option">
        {{ option }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Field } from "../composables/useSchemaParser";

const props = defineProps<{ field: Field; modelValue: any }>();
const emit = defineEmits(["update:modelValue"]);

const localValue = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});
</script>
