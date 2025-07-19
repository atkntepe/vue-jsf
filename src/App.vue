<template>
  <div class="min-h-screen bg-zinc-900 flex items-center justify-center">
    <div class="p-4 max-w-lg w-full bg-zinc-800 rounded-lg shadow-lg">
      <h1 class="text-2xl font-bold mb-4 text-zinc-50">
        Vue JSON Schema Form Test
      </h1>
      <SchemaForm
        :schema="testSchema"
        v-model="formData"
        :registry="testRegistry"
      />
      <pre class="!text-zinc-50">{{ formData }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, markRaw } from "vue";
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
  },
  required: ["name"],
};

const formData = ref({});
</script>

