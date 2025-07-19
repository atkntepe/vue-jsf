<template>
  <div class="array-field">
    <label class="block text-sm font-medium text-gray-200 mb-2">
      {{ field.label }}
      <span v-if="field.required" class="text-red-500">*</span>
    </label>
    <p v-if="field.description" class="text-sm text-gray-400 mb-3">
      {{ field.description }}
    </p>
    
    <div class="space-y-3">
      <div 
        v-for="(item, index) in arrayValue" 
        :key="index"
        class="border border-gray-600 rounded-lg p-3 bg-gray-800"
      >
        <div class="flex justify-between items-start mb-2">
          <span class="text-sm text-gray-300">Item {{ index + 1 }}</span>
          <button
            @click="removeItem(index)"
            :disabled="!canRemove"
            class="text-red-500 hover:text-red-400 disabled:text-gray-500 disabled:cursor-not-allowed text-sm"
            type="button"
          >
            Remove
          </button>
        </div>
        
        <div v-if="isSimpleArray && field.items && field.items[0]">
          <component
            :is="getFieldComponent(field.items[0].type)"
            :field="{ ...field.items[0], path: `${field.path}.${index}` }"
            :modelValue="item"
            @update:modelValue="updateItem(index, $event)"
            :errors="getItemErrors(index)"
          />
        </div>
        
        <div v-else-if="isObjectArray">
          <SchemaForm
            :schema="getObjectSchema()"
            :modelValue="item || {}"
            @update:modelValue="updateItem(index, $event)"
          />
        </div>
      </div>
    </div>
    
    <button
      @click="addItem"
      :disabled="!canAdd"
      class="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-sm"
      type="button"
    >
      Add Item
    </button>
    
    <div v-if="errors.length" class="mt-2">
      <p v-for="error in errors" :key="error.$uid" class="text-red-500 text-sm">
        {{ error.$message }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import type { Field } from '../composables/useSchemaParser';
import { SchemaForm } from '../index';

interface Props {
  field: Field;
  modelValue: any[];
  errors?: any[];
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  errors: () => []
});

const emit = defineEmits<{
  'update:modelValue': [value: any[]]
}>();

const fieldRegistry = inject<Record<string, any>>('fieldRegistry', {});

const arrayValue = computed(() => {
  return Array.isArray(props.modelValue) ? props.modelValue : [];
});

const canAdd = computed(() => {
  if (typeof props.field.maxItems === 'number') {
    return arrayValue.value.length < props.field.maxItems;
  }
  return true;
});

const canRemove = computed(() => {
  if (typeof props.field.minItems === 'number') {
    return arrayValue.value.length > props.field.minItems;
  }
  return arrayValue.value.length > 0;
});

const isSimpleArray = computed(() => {
  return props.field.items && 
         props.field.items.length === 1 && 
         !props.field.items[0].children;
});

const isObjectArray = computed(() => {
  return props.field.items && 
         props.field.items.length > 1;
});

const getFieldComponent = (type: string) => {
  return fieldRegistry[type] || 'div';
};

const getObjectSchema = () => {
  // For object arrays, field.items contains an array of Field objects (one for each property)
  if (props.field.items && props.field.items.length > 0) {
    const properties: any = {};
    const required: string[] = [];
    
    props.field.items.forEach((itemField: Field) => {
      properties[itemField.key] = {
        type: itemField.type === 'textfield' ? 'string' : 
              itemField.type === 'numberfield' ? 'number' : 
              itemField.type === 'checkbox' ? 'boolean' :
              itemField.type === 'select' ? 'string' : 'string',
        title: itemField.label,
        description: itemField.description,
        ...(itemField.enum ? { enum: itemField.enum } : {}),
        ...(itemField.default !== undefined ? { default: itemField.default } : {}),
        ...(itemField.minLength !== undefined ? { minLength: itemField.minLength } : {}),
        ...(itemField.maxLength !== undefined ? { maxLength: itemField.maxLength } : {}),
        ...(itemField.minimum !== undefined ? { minimum: itemField.minimum } : {}),
        ...(itemField.maximum !== undefined ? { maximum: itemField.maximum } : {})
      };
      if (itemField.required) {
        required.push(itemField.key);
      }
    });
    
    return {
      type: 'object',
      properties,
      ...(required.length > 0 ? { required } : {})
    };
  }
  return { type: 'object', properties: {} };
};

const addItem = () => {
  if (!canAdd.value) return;
  
  const newItem = getDefaultItem();
  const newArray = [...arrayValue.value, newItem];
  emit('update:modelValue', newArray);
};

const removeItem = (index: number) => {
  if (!canRemove.value) return;
  
  const newArray = arrayValue.value.filter((_, i) => i !== index);
  emit('update:modelValue', newArray);
};

const updateItem = (index: number, value: any) => {
  const newArray = [...arrayValue.value];
  newArray[index] = value;
  emit('update:modelValue', newArray);
};

const getDefaultItem = () => {
  if (!props.field.items || props.field.items.length === 0) {
    return '';
  }
  
  // Handle object arrays (multiple field items)
  if (isObjectArray.value) {
    const defaultObj: any = {};
    props.field.items.forEach((itemField: Field) => {
      if (itemField.default !== undefined) {
        defaultObj[itemField.key] = itemField.default;
      } else {
        defaultObj[itemField.key] = itemField.type === 'numberfield' ? 0 :
                                   itemField.type === 'checkbox' ? false : '';
      }
    });
    return defaultObj;
  }
  
  // Handle primitive arrays (single field item)
  const itemField = props.field.items[0];
  return itemField.default ?? (
    itemField.type === 'numberfield' ? 0 :
    itemField.type === 'checkbox' ? false :
    ''
  );
};

const getItemErrors = (index: number) => {
  return props.errors.filter((error: any) => 
    error.$property && error.$property.startsWith(`${index}.`)
  );
};
</script>