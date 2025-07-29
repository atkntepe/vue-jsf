import {
  defineComponent,
  h,
  ref,
  markRaw,
  resolveComponent,
  computed,
  provide,
  watch,
} from "vue";
import { useSchemaParser } from "./composables/useSchemaParser";
import { useUISchemaParser } from "./composables/useUISchemaParser";
import type { UISchema } from "./types";
import TextField from "./components/TextField.vue";
import NumberField from "./components/NumberField.vue";
import CheckboxField from "./components/CheckboxField.vue";
import SelectField from "./components/SelectField.vue";
import ArrayField from "./components/ArrayField.vue";
import FormattedField from "./components/FormattedField.vue";
import PasswordField from "./components/PasswordField.vue";
import DateField from "./components/DateField.vue";
import FileUpload from "./components/FileUpload.vue";
import MultiSelect from "./components/MultiSelect.vue";
import { useVuelidate } from "@vuelidate/core"; // New core import
import { required, minLength, minValue, maxValue } from "@vuelidate/validators";
import { useFormState } from "./composables/useFormState";

type FieldRegistry = Record<string, any>;

const defaultRegistry: FieldRegistry = {
  textfield: markRaw(TextField),
  numberfield: markRaw(NumberField),
  checkbox: markRaw(CheckboxField),
  select: markRaw(SelectField),
  arrayfield: markRaw(ArrayField),
  formattedfield: markRaw(FormattedField),
  passwordfield: markRaw(PasswordField),
  datefield: markRaw(DateField),
  datetimefield: markRaw(DateField),
  timefield: markRaw(TextField),
  uuidfield: markRaw(TextField),
  colorfield: markRaw(TextField),
  fileupload: markRaw(FileUpload),
  multiselect: markRaw(MultiSelect),
};

const predefinedRegistries: Record<string, FieldRegistry> = {
  primevue: {
    textfield: "InputText",
    numberfield: "InputNumber",
    checkbox: "Checkbox",
    select: "Select",
    formattedfield: "InputText",
    passwordfield: "Password",
    datefield: "Calendar",
  },
  vuetify: {
    textfield: "VTextField",
    numberfield: "VTextField",
    checkbox: "VCheckbox",
    select: "VSelect",
    formattedfield: "VTextField",
    passwordfield: "VTextField",
    datefield: "VDatePicker",
  },
  nuxtui: {
    textfield: "UInput",
    numberfield: "UInput",
    checkbox: "UCheckbox",
    select: "USelect",
    formattedfield: "UInput",
    passwordfield: "UInput",
    datefield: "UInput",
  },
};

export const SchemaForm = defineComponent({
  name: "SchemaForm",
  props: {
    schema: { type: Object, required: true },
    uiSchema: { type: Object as () => UISchema, default: () => ({}) },
    modelValue: { type: Object, default: () => ({}) },
    registry: { type: [Object, String], default: "default" },
  },
  emits: ["update:modelValue", "submit", "form-state-change"],
  setup(props, { emit, slots }) {
    const formData = ref(props.modelValue);
    
    // Initialize form state management
    const formStateManager = useFormState(props.modelValue);
    
    // Create reactive fields that update based on form data
    const fields = computed(() => {
      const parser = useSchemaParser(props.schema);
      const uiParser = useUISchemaParser();
      
      // Re-parse with current form data to apply conditional logic
      const baseFields = parser.parseFieldsWithData(formData.value);
      
      // Process fields with UI schema to get enhanced fields
      const enhancedFields = baseFields.map(field => 
        uiParser.parseUISchema(field, props.uiSchema, [field.key])
      );

      // Process field order if specified in UI schema
      return uiParser.processFieldOrder(enhancedFields, props.uiSchema['ui:order']);
    });

    const fieldRegistry = ref<FieldRegistry>(defaultRegistry);
    if (typeof props.registry === "string") {
      fieldRegistry.value =
        predefinedRegistries[props.registry] || defaultRegistry;
    } else if (typeof props.registry === "object") {
      fieldRegistry.value = { ...defaultRegistry, ...props.registry };
    }

    provide("fieldRegistry", fieldRegistry.value);

    const rules = computed(() => {
      const validationRules: Record<string, any> = {};
      fields.value.forEach((field) => {
        const fieldRules = [];
        if (field.required) fieldRules.push(required);

        if (typeof field.minLength === "number") {
          fieldRules.push(minLength(field.minLength));
        }
        if (typeof field.minimum === "number") {
          fieldRules.push(minValue(field.minimum));
        }
        if (typeof field.maximum === "number") {
          fieldRules.push(maxValue(field.maximum));
        }
        validationRules[field.path] = fieldRules;
      });
      return validationRules;
    });
    const v$ = useVuelidate(rules, formData, { $autoDirty: true });

    const updateField = (path: string, value: any) => {
      const keys = path.split(".");
      let current = formData.value;
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (/^\d+$/.test(key)) {
          const index = parseInt(key);
          if (!Array.isArray(current)) current = [];
          while (current.length <= index) {
            current.push(undefined);
          }
          if ((current as any[])[index] === undefined) {
            (current as any[])[index] = {};
          }
          current = (current as any[])[index];
        } else {
          if (!current[key]) {
            const nextKey = keys[i + 1];
            if (nextKey && /^\d+$/.test(nextKey)) {
              current[key] = [];
            } else {
              current[key] = {};
            }
          }
          current = current[key];
        }
      }
      const lastKey = keys[keys.length - 1];
      if (/^\d+$/.test(lastKey)) {
        const index = parseInt(lastKey);
        if (!Array.isArray(current)) current = [];
        while (current.length <= index) {
          current.push(undefined);
        }
        (current as any[])[index] = value;
      } else {
        current[lastKey] = value;
      }
      
      // Update form state management
      try {
        const fieldErrors = v$.value[path]?.$errors || [];
        formStateManager.updateField(path, value, fieldErrors);
      } catch (error) {
        console.warn('Form state update error:', error);
      }
      
      emit("update:modelValue", formData.value);
      emit("form-state-change", formStateManager.formState.value);
    };

    const getNestedValue = (data: any, path: string, defaultValue: any) => {
      return (
        path.split(".").reduce((obj, key) => obj?.[key], data) ?? defaultValue
      );
    };

    const touchField = (path: string) => {
      try {
        formStateManager.touchField(path);
        emit("form-state-change", formStateManager.formState.value);
      } catch (error) {
        console.warn('Touch field error:', error);
      }
    };

    const resetForm = (newInitialData?: any) => {
      const resetData = newInitialData ?? props.modelValue;
      formData.value = JSON.parse(JSON.stringify(resetData));
      formStateManager.resetForm(resetData);
      emit("update:modelValue", formData.value);
      emit("form-state-change", formStateManager.formState.value);
    };

    const resetField = (path: string) => {
      formStateManager.resetField(path);
      const resetValue = formStateManager.getFieldState(path)?.initialValue;
      if (resetValue !== undefined) {
        updateField(path, resetValue);
      }
    };


    // Watch for field changes to initialize new fields
    watch(fields, (newFields) => {
      if (newFields && Array.isArray(newFields)) {
        newFields.forEach(field => {
          if (field && field.path && !formStateManager.getFieldState(field.path)) {
            const currentValue = getNestedValue(formData.value, field.path, field.default);
            formStateManager.initializeField(field.path, currentValue);
          }
        });
      }
    }, { immediate: true });

    // Watch for prop changes to reset form state
    watch(() => props.modelValue, (newValue) => {
      formData.value = newValue;
      formStateManager.resetForm(newValue);
      emit("form-state-change", formStateManager.formState.value);
    }, { deep: true });

    const renderField = (field: any): any => {
      const fieldSlotName = `field-${field.type}`;
      if (slots[fieldSlotName]) {
        const slotProps = {
          field,
          value: getNestedValue(formData.value, field.path, field.default),
          update: (val: any) => updateField(field.path, val),
          touch: () => touchField(field.path),
          errors: v$.value[field.path]?.$errors || [],
          fieldState: formStateManager.getFieldState(field.path),
        };

        if (field.type === "arrayfield") {
          const arrayValue = getNestedValue(
            formData.value,
            field.path,
            field.default || [],
          );
          slotProps.value = Array.isArray(arrayValue) ? arrayValue : [];
        }

        return slots[fieldSlotName]!(slotProps);
      }

      // Use widget-based component selection if UI schema widget is specified
      // OVERRIDE: Force multiselect for array enum fields
      let componentKey;
      if (field.type === 'multiselect') {
        componentKey = 'multiselect'; // Force multiselect component
      } else {
        componentKey = field.widget ? field.widget : field.type;
      }
      let Component = fieldRegistry.value[componentKey];
      
      if (field.key === "skills" || field.key === "interests") {
        console.log(`🎨 COMPONENT SELECTION - ${field.key}:`, {
          fieldType: field.type,
          widget: field.widget,
          componentKey,
          hasComponent: !!Component,
          componentName: Component?.name || 'Unknown',
          OVERRIDE_APPLIED: field.type === 'multiselect'
        });
      }
      
      if (!Component) {
        // Fallback to field type if widget not found
        Component = fieldRegistry.value[field.type];
        if (field.key === "skills" || field.key === "interests") {
          console.log(`⚠️ COMPONENT FALLBACK - ${field.key}: ${field.type} -> ${!!Component}`);
        }
      }
      
      if (!Component) {
        // Default to div element for unknown field types
        Component = "div";
      } else if (typeof Component === "string") {
        Component = resolveComponent(Component) || "div";
      }

      if (field.children?.length) {
        return h(
          "fieldset",
          { class: "border border-zinc-600 p-4 mb-4 rounded-md" },
          [
            h("legend", { class: "text-sm text-gray-300" }, field.label),
            field.children.map((child: any) => renderField(child)),
          ],
        );
      }

      // Handle schema composition (oneOf/anyOf) or composition type
      if (field.type === "composition" || field.oneOf || field.anyOf) {
        const options = field.oneOf || field.anyOf;
        const currentValue = getNestedValue(formData.value, field.path, null);
        const selectedOption = currentValue?._schemaOption !== undefined ? currentValue._schemaOption : -1;
        
        // Convert schema options to simple field arrays without using the parser
        const parsedOptions = options.map((option: any) => {
          if (Array.isArray(option)) {
            return option; // Already parsed
          } else if (option.properties) {
            // Convert properties to simple field objects
            return Object.entries(option.properties).map(([key, prop]: [string, any]) => ({
              key,
              path: `${field.path}.${key}`,
              type: prop.enum ? "select" : prop.type === "string" ? "textfield" : prop.type === "number" ? "numberfield" : "textfield",
              format: prop.format,
              label: prop.title || key.charAt(0).toUpperCase() + key.slice(1),
              description: prop.description || "",
              required: (option.required || []).includes(key),
              enum: prop.enum || null,
              default: prop.default,
              rules: [],
              pattern: prop.pattern
            }));
          }
          return [];
        });
        
        // Create a temporary field for the select component
        const selectField = {
          ...field,
          type: "select",
          enum: [
            { value: -1, label: "Select type..." },
            ...options.map((option: any, index: number) => ({
              value: index,
              label: option.title || `Option ${index + 1}`
            }))
          ],
          path: `${field.path}._schemaOption`
        };

        return h("div", { class: "mb-4" }, [
          // Render the select directly using the component
          h(
            fieldRegistry.value.select || SelectField,
            {
              field: selectField,
              modelValue: getNestedValue(formData.value, selectField.path, -1),
              'onUpdate:modelValue': (val: any) => updateField(selectField.path, val),
              errors: v$.value[selectField.path]?.$errors || []
            }
          ),
          // Render fields for selected option only
          selectedOption >= 0 && selectedOption < parsedOptions.length && 
          h("div", { class: "border border-slate-200 dark:border-slate-800 rounded-md p-4 bg-slate-50/50 dark:bg-slate-900/50 mt-3" }, [
            ...parsedOptions[selectedOption].map((optionField: any) => {
              // Create a new field with the correct path prefix
              const adjustedField = {
                ...optionField,
                path: `${field.path}.${optionField.key}`
              };
              return renderField(adjustedField);
            })
          ])
        ]);
      }

      // Handle readonly/const fields
      if (field.type === "readonly") {
        return h("div", { class: "mb-4" }, [
          h("label", { class: "block text-sm font-medium mb-2" }, field.label),
          h("input", {
            type: "text",
            value: field.default,
            readonly: true,
            class: "w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed",
            title: "This value is constant and cannot be changed"
          }),
          field.description && h("p", { class: "text-xs text-gray-500 mt-1" }, field.description)
        ]);
      }

      if (field.type === "arrayfield") {
        const arrayValue = getNestedValue(
          formData.value,
          field.path,
          field.default || [],
        );
        return h(Component, {
          field,
          modelValue: Array.isArray(arrayValue) ? arrayValue : [],
          "onUpdate:modelValue": (val: any) => updateField(field.path, val),
          onFocus: () => touchField(field.path),
          errors: v$.value[field.path]?.$errors || [],
          fieldState: formStateManager.getFieldState(field.path),
        });
      }

      return h(Component, {
        field,
        modelValue: getNestedValue(formData.value, field.path, field.default),
        "onUpdate:modelValue": (val: any) => updateField(field.path, val),
        onFocus: () => touchField(field.path),
        errors: v$.value[field.path]?.$errors || [],
        fieldState: formStateManager.getFieldState(field.path),
        ...(field.type === "numberfield" && Component === "VTextField"
          ? { type: "number" }
          : {}),
      });
    };

    const submitFn = () => {
      v$.value.$validate();
      if (!v$.value.$invalid) {
        emit("submit", formData.value);
      }
    };

    return () => {
      const formContent = fields.value.map(renderField);

      if (slots.default) {
        return slots.default({
          fields: fields.value,
          formData: formData.value,
          v$: v$.value,
          submit: submitFn,
          formState: formStateManager.formState.value,
          resetForm,
          resetField,
          touchField,
          getFieldState: formStateManager.getFieldState,
          isFieldDirty: formStateManager.isFieldDirty,
          isFieldTouched: formStateManager.isFieldTouched,
          getDirtyFields: formStateManager.getDirtyFields,
          getChangedValues: formStateManager.getChangedValues,
        });
      }

      return h("form", { class: "schema-form" }, formContent);
    };
  },
});

export default SchemaForm;
export { useSchemaParser };
export { useFormState, type FormState, type FieldState } from "./composables/useFormState";
