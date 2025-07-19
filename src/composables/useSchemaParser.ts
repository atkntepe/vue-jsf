import { computed } from "vue";
import Ajv from "ajv";

export interface Field {
  key: string;
  path: string;
  type: string;
  label: string;
  description: string;
  required: boolean;
  enum?: string[] | null;
  default?: any;
  rules: ((v: any) => boolean | string)[];
  children?: Field[];
  items?: Field[];
}

export function useSchemaParser(schema: any) {
  const ajv = new Ajv({ allErrors: true });
  let validator: ((data: any) => boolean) | null = null;
  try {
    validator = ajv.compile(schema);
  } catch (error) {
    console.error("Invalid schema:", error);
  }

  const mapType = (schemaType: string) => {
    switch (schemaType) {
      case "string":
        return "textfield";
      case "number":
      case "integer":
        return "numberfield";
      case "boolean":
        return "checkbox";

      default:
        return schemaType;
    }
  };

  const parseFields = (subSchema: any, path: string[] = []): Field[] => {
    if (subSchema.type !== "object" || !subSchema.properties) return [];

    return Object.entries(subSchema.properties).map(
      ([key, field]: [string, any]) => {
        const fullPath = [...path, key];
        return {
          key,
          path: fullPath.join("."),
          type: mapType(field.type || "string"),
          label: field.title || key.charAt(0).toUpperCase() + key.slice(1),
          description: field.description || "",
          required: (subSchema.required || []).includes(key),
          enum: field.enum || null,
          default: field.default,
          rules: getRules(field),
          children:
            field.type === "object" ? parseFields(field, fullPath) : undefined,
          items:
            field.type === "array" && field.items
              ? parseFields(field.items, fullPath)
              : undefined,
        };
      },
    );
  };

  const getRules = (field: any): ((v: any) => boolean | string)[] => {
    const rules: ((v: any) => boolean | string)[] = [];
    if (field.minLength)
      rules.push(
        (v: string) =>
          (v?.length ?? 0) >= field.minLength || `Min ${field.minLength} chars`,
      );
    if (field.maxLength)
      rules.push(
        (v: string) =>
          (v?.length ?? 0) <= field.maxLength || `Max ${field.maxLength} chars`,
      );
    if (field.pattern)
      rules.push(
        (v: string) => new RegExp(field.pattern).test(v) || "Invalid format",
      );

    return rules;
  };

  const fields = computed(() => parseFields(schema));

  const validate = (data: any) => (validator ? validator(data) : false);

  return { fields, validate };
}
