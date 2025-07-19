<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">JSON Schema $ref Demo</h1>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <h2 class="text-xl font-semibold mb-3">Schema with $refs</h2>
        <pre class="bg-gray-100 p-4 rounded text-sm overflow-auto">{{ JSON.stringify(schema, null, 2) }}</pre>
      </div>
      
      <div>
        <h2 class="text-xl font-semibold mb-3">Generated Form</h2>
        <FormRenderer :schema="schema" v-model="formData" />
        
        <div class="mt-4">
          <h3 class="text-lg font-semibold mb-2">Form Data</h3>
          <pre class="bg-gray-100 p-4 rounded text-sm">{{ JSON.stringify(formData, null, 2) }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FormRenderer from '../src/components/FormRenderer.vue'

const formData = ref({})

// Schema with $refs demonstrating reusable address schema
const schema = {
  type: "object",
  title: "User Profile with References",
  properties: {
    name: {
      type: "string",
      title: "Full Name"
    },
    email: {
      type: "string",
      format: "email",
      title: "Email Address"
    },
    homeAddress: {
      $ref: "#/$defs/address"
    },
    billingAddress: {
      $ref: "#/$defs/address"
    },
    workHistory: {
      type: "array",
      title: "Work History",
      items: {
        $ref: "#/$defs/job"
      }
    },
    emergencyContacts: {
      type: "array",
      title: "Emergency Contacts",
      items: {
        type: "object",
        properties: {
          name: { type: "string", title: "Contact Name" },
          relationship: { type: "string", title: "Relationship" },
          address: {
            $ref: "#/$defs/address"
          }
        },
        required: ["name", "relationship"]
      }
    }
  },
  required: ["name", "email"],
  $defs: {
    address: {
      type: "object",
      title: "Address",
      properties: {
        street: {
          type: "string",
          title: "Street Address"
        },
        city: {
          type: "string",
          title: "City"
        },
        state: {
          type: "string",
          title: "State/Province"
        },
        zipCode: {
          type: "string",
          title: "ZIP/Postal Code"
        },
        country: {
          type: "string",
          title: "Country",
          default: "US"
        }
      },
      required: ["street", "city", "state", "zipCode"]
    },
    job: {
      type: "object",
      title: "Job",
      properties: {
        company: {
          type: "string",
          title: "Company Name"
        },
        position: {
          type: "string",
          title: "Position"
        },
        startDate: {
          type: "string",
          format: "date",
          title: "Start Date"
        },
        endDate: {
          type: "string",
          format: "date",
          title: "End Date"
        },
        companyAddress: {
          $ref: "#/$defs/address"
        }
      },
      required: ["company", "position", "startDate"]
    }
  }
}
</script>