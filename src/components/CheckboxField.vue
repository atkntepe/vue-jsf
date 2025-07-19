<template>
  <div class="mb-4 flex items-center">
    <input
      :id="field.path"
      v-model="localValue"
      type="checkbox"
      class="h-4 w-4 text-blue-500 bg-zinc-700 border-zinc-600 rounded focus:ring-blue-500"
    />
    <label :for="field.path" class="ml-2 text-sm text-gray-300">
      {{ field.label }}
      <span v-if="field.required" class="text-red-500">*</span>
    </label>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Field } from "../composables/useSchemaParser";

const props = defineProps<{ field: Field; modelValue: any }>();
const emit = defineEmits(["update:modelValue"]);

const localValue = computed({
  get: () => !!props.modelValue,
  set: (val) => emit("update:modelValue", val),
});
</script>
