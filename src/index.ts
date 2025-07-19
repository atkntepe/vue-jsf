import { defineComponent, h, ref, markRaw, resolveComponent, computed } from "vue";
import { useSchemaParser } from "./composables/useSchemaParser";
import TextField from "./components/TextField.vue";
import NumberField from "./components/NumberField.vue";
import CheckboxField from "./components/CheckboxField.vue";
import SelectField from "./components/SelectField.vue";
import { useVuelidate } from "@vuelidate/core"; // New core import
import { required } from "@vuelidate/validators"; // Built-in for requiredtype FieldRegistry = Record<string, any>;
type FieldRegistry = Record<string, any>;

const defaultRegistry: FieldRegistry = {
  textfield: markRaw(TextField),
  numberfield: markRaw(NumberField),
  checkbox: markRaw(CheckboxField),
  select: markRaw(SelectField),
};

const predefinedRegistries: Record<string, FieldRegistry> = {
  primevue: {
    textfield: "InputText",
    numberfield: "InputNumber",
    checkbox: "Checkbox",
    select: "Select",
  },
  vuetify: {
    textfield: "VTextField",
    numberfield: "VTextField",
    checkbox: "VCheckbox",
    select: "VSelect",
  },
  nuxtui: {
    textfield: "UInput",
    numberfield: "UInput",
    checkbox: "UCheckbox",
    select: "USelect",
  },
};

export const SchemaForm = defineComponent({
  name: "SchemaForm",
  props: {
    schema: { type: Object, required: true },
    modelValue: { type: Object, default: () => ({}) },
    registry: { type: [Object, String], default: "default" },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const { fields } = useSchemaParser(props.schema);
    const formData = ref(props.modelValue);

    const rules = computed(() => {
      const validationRules: any = {};
      fields.value.forEach((field) => {
        const fieldRules: any = [...field.rules]; // Custom from schema
        if (field.required) fieldRules.push(required); // Add built-in required
        validationRules[field.path] = fieldRules;
      });
      return validationRules;
    });
    const v$ = useVuelidate(rules, formData, { $autoDirty: true });

    const fieldRegistry = ref<FieldRegistry>(defaultRegistry);
    if (typeof props.registry === "string") {
      fieldRegistry.value =
        predefinedRegistries[props.registry] || defaultRegistry;
    } else if (typeof props.registry === "object") {
      fieldRegistry.value = { ...defaultRegistry, ...props.registry };
    }

    const updateField = (path: string, value: any) => {
      const keys = path.split(".");
      let current = formData.value;
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (!current[key]) current[key] = {};
        current = current[key];
      }
      current[keys[keys.length - 1]] = value;
      emit("update:modelValue", formData.value);
    };

    const getNestedValue = (data: any, path: string, defaultValue: any) => {
      return (
        path.split(".").reduce((obj, key) => obj?.[key], data) ?? defaultValue
      );
    };

    const renderField = (field: any) => {
      let Component = fieldRegistry.value[field.type] || "div";
      if (typeof Component === "string") {
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
      return h(Component, {
        field,
        modelValue: getNestedValue(formData.value, field.path, field.default),
        "onUpdate:modelValue": (val: any) => updateField(field.path, val),
        errors: v$.value[field.path]?.$errors || [], // Pass errors array
        ...(field.type === "numberfield" && Component === "VTextField"
          ? { type: "number" }
          : {}),
      });
    };

    return () =>
      h("form", { class: "schema-form" }, fields.value.map(renderField));
  },
});

export default SchemaForm;
export { useSchemaParser };

