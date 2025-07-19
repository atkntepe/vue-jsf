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
  minLength?: number;
  maxLength?: number;
  minimum?: number;
  maximum?: number;
  minItems?: number;
  maxItems?: number;
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
      case "array":
        return "arrayfield";
      default:
        return schemaType;
    }
  };

  const parseFields = (subSchema: any, path: string[] = []): Field[] => {
    if (subSchema.type !== "object" || !subSchema.properties) return [];

    return Object.entries(subSchema.properties).map(
      ([key, field]: [string, any]) => {
        const fullPath = [...path, key];
        const baseType = mapType(field.type || "string");
        return {
          key,
          path: fullPath.join("."),
          type: field.enum ? "select" : baseType,
          label: field.title || key.charAt(0).toUpperCase() + key.slice(1),
          description: field.description || "",
          required: (subSchema.required || []).includes(key),
          enum: field.enum || null,
          default: field.default,
          rules: getRules(field),
          minLength: field.minLength,
          maxLength: field.maxLength,
          minimum: field.minimum,
          maximum: field.maximum,
          minItems: field.minItems,
          maxItems: field.maxItems,
          children:
            field.type === "object" ? parseFields(field, fullPath) : undefined,
          items:
            field.type === "array" && field.items
              ? field.items.type === "object" 
                ? parseFields(field.items, [...fullPath, "0"])
                : [{ 
                    key: "item", 
                    path: [...fullPath, "0"].join("."), 
                    type: mapType(field.items.type || "string"), 
                    label: field.items.title || "Item", 
                    description: field.items.description || "", 
                    required: false, 
                    enum: field.items.enum || null, 
                    default: field.items.default, 
                    rules: getRules(field.items),
                    minLength: field.items.minLength,
                    maxLength: field.items.maxLength,
                    minimum: field.items.minimum,
                    maximum: field.items.maximum
                  }]
              : undefined,
        };
      },
    );
  };

  const getRules = (field: any): ((v: any) => boolean | string)[] => {
    const rules: ((v: any) => boolean | string)[] = [];
    if (typeof field.minLength === "number") {
      rules.push(
        (v: string) =>
          (v?.length ?? 0) >= field.minLength || `This field should be at least ${field.minLength} characters long`,
      );
    }
    if (field.maxLength)
      rules.push(
        (v: string) =>
          (v?.length ?? 0) <= field.maxLength || `Max ${field.maxLength} chars`,
      );
    if (typeof field.minimum === "number") {
      rules.push(
        (v: number) =>
          v >= field.minimum || `Minimum value is ${field.minimum}`,
      );
    }
    if (typeof field.maximum === "number") {
      rules.push(
        (v: number) =>
          v <= field.maximum || `Maximum value is ${field.maximum}`,
      );
    }
    if (field.pattern)
      rules.push(
        (v: string) => new RegExp(field.pattern).test(v) || "Invalid format",
      );
    if (typeof field.minItems === "number") {
      rules.push(
        (v: any[]) =>
          (v?.length ?? 0) >= field.minItems || `Minimum ${field.minItems} items required`,
      );
    }
    if (typeof field.maxItems === "number") {
      rules.push(
        (v: any[]) =>
          (v?.length ?? 0) <= field.maxItems || `Maximum ${field.maxItems} items allowed`,
      );
    }
    return rules;
  };

  const fields = computed(() => parseFields(schema));

  const validate = (data: any) => (validator ? validator(data) : false);

  return { fields, validate };
}
