import {
  defineComponent,
  h,
  ref,
  markRaw,
  resolveComponent,
  computed,
  provide,
} from "vue";
import { useSchemaParser } from "./composables/useSchemaParser";
import TextField from "./components/TextField.vue";
import NumberField from "./components/NumberField.vue";
import CheckboxField from "./components/CheckboxField.vue";
import SelectField from "./components/SelectField.vue";
import ArrayField from "./components/ArrayField.vue";
import FormattedField from "./components/FormattedField.vue";
import PasswordField from "./components/PasswordField.vue";
import DateField from "./components/DateField.vue";
import { useVuelidate } from "@vuelidate/core"; // New core import
import { required, minLength, minValue, maxValue } from "@vuelidate/validators";

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
    modelValue: { type: Object, default: () => ({}) },
    registry: { type: [Object, String], default: "default" },
  },
  emits: ["update:modelValue", "submit"],
  setup(props, { emit, slots }) {
    const { fields } = useSchemaParser(props.schema);
    const formData = ref(props.modelValue);

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
      emit("update:modelValue", formData.value);
    };

    const getNestedValue = (data: any, path: string, defaultValue: any) => {
      return (
        path.split(".").reduce((obj, key) => obj?.[key], data) ?? defaultValue
      );
    };

    const renderField = (field: any) => {
      const fieldSlotName = `field-${field.type}`;
      if (slots[fieldSlotName]) {
        const slotProps = {
          field,
          value: getNestedValue(formData.value, field.path, field.default),
          update: (val: any) => updateField(field.path, val),
          errors: v$.value[field.path]?.$errors || [],
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

      let Component = fieldRegistry.value[field.type];
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
          errors: v$.value[field.path]?.$errors || [],
        });
      }

      return h(Component, {
        field,
        modelValue: getNestedValue(formData.value, field.path, field.default),
        "onUpdate:modelValue": (val: any) => updateField(field.path, val),
        errors: v$.value[field.path]?.$errors || [],
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
        });
      }

      return h("form", { class: "schema-form" }, formContent);
    };
  },
});

export default SchemaForm;
export { useSchemaParser };
