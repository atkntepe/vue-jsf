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
    skills: {
      type: "array",
      title: "Skills",
      description: "List your skills",
      items: { type: "string", title: "Skill" },
      minItems: 1,
      maxItems: 5
    },
    hobbies: {
      type: "array",
      title: "Hobbies",
      items: { type: "string", title: "Hobby", maxLength: 20 }
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
            enum: ["family", "friend", "colleague"]
          }
        },
        required: ["name", "phone"]
      },
      minItems: 1,
      maxItems: 3
    }
  },
  required: ["name", "age", "skills"],
};

const formData = ref({});
</script>
