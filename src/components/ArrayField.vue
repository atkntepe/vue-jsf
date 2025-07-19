<template>
  <div class="space-y-4 mb-8">
    <div class="space-y-1">
      <label class="text-sm font-medium text-slate-900 dark:text-slate-100">
        {{ field.label }}
        <span v-if="field.required" class="text-red-500 ml-1">*</span>
      </label>
      <p v-if="field.description" class="text-sm text-slate-600 dark:text-slate-400">
        {{ field.description }}
      </p>
    </div>
    
    <div class="space-y-3">
      <div 
        v-for="(item, index) in arrayValue" 
        :key="index"
        class="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-4"
      >
        <div class="flex justify-between items-center mb-3">
          <div class="flex items-center gap-2">
            <div class="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
            <span class="text-sm font-medium text-slate-900 dark:text-slate-100">
              Item {{ index + 1 }}
            </span>
          </div>
          <button
            @click="removeItem(index)"
            :disabled="!canRemove"
            class="inline-flex items-center gap-1 px-2 py-1 text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-md transition-colors disabled:text-slate-400 dark:disabled:text-slate-600 disabled:cursor-not-allowed disabled:hover:bg-transparent"
            type="button"
          >
            <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
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
      class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white text-sm font-medium rounded-md transition-colors disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed disabled:text-slate-300"
      type="button"
    >
      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
      </svg>
      Add Item
    </button>
    
    <div v-if="errors.length" class="space-y-1">
      <p v-for="error in errors" :key="error.$uid" class="text-sm text-red-500 dark:text-red-400">
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