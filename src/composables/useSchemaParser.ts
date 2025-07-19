import { computed } from "vue";
import Ajv from "ajv";
import addFormats from "ajv-formats";

export interface Field {
  key: string;
  path: string;
  type: string;
  format?: string;
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
  const ajv = new Ajv({ 
    allErrors: true,
    validateSchema: false, // Disable meta-schema validation to avoid draft version conflicts
    strict: false // Be more lenient with unknown keywords
  });
  addFormats(ajv);

  ajv.addFormat("tel", /^[\+]?[1-9][\d]{0,15}$/);

  let validator: ((data: any) => boolean) | null = null;
  try {
    // Create a clean copy of schema without meta-schema references for validation
    const cleanSchema = { ...schema };
    delete cleanSchema.$id;
    delete cleanSchema.$schema;
    
    validator = ajv.compile(cleanSchema);
  } catch (error) {
    console.error("Invalid schema:", error);
  }

  // $ref resolution with cycle detection
  const resolveRef = (refPath: string, rootSchema: any, visited: Set<string> = new Set()): any => {
    if (visited.has(refPath)) {
      console.warn(`Circular reference detected: ${refPath}`);
      return null;
    }
    
    visited.add(refPath);
    
    // Handle local references starting with #/
    if (refPath.startsWith('#/')) {
      const path = refPath.substring(2).split('/');
      let current = rootSchema;
      
      for (const segment of path) {
        if (current && typeof current === 'object' && segment in current) {
          current = current[segment];
        } else {
          console.warn(`Invalid reference path: ${refPath}`);
          return null;
        }
      }
      
      // If the resolved schema also has a $ref, resolve it recursively
      if (current && typeof current === 'object' && current.$ref) {
        return resolveRef(current.$ref, rootSchema, visited);
      }
      
      return current;
    }
    
    console.warn(`External references not supported: ${refPath}`);
    return null;
  };

  // Resolve all $ref in a schema object recursively
  const resolveAllRefs = (obj: any, rootSchema: any, visited: Set<string> = new Set()): any => {
    if (!obj || typeof obj !== 'object') {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => resolveAllRefs(item, rootSchema, visited));
    }

    if (obj.$ref) {
      const resolved = resolveRef(obj.$ref, rootSchema, new Set(visited));
      if (resolved) {
        // Merge other properties if they exist alongside $ref
        const { $ref, ...otherProps } = obj;
        const mergedSchema = { ...resolved, ...otherProps };
        return resolveAllRefs(mergedSchema, rootSchema, visited);
      }
      return null;
    }

    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = resolveAllRefs(value, rootSchema, visited);
    }
    return result;
  };

  const mapTypeWithFormat = (schemaType: string, format?: string) => {
    if (format === "enum") {
      return "select";
    }

    if (schemaType === "string" && format) {
      switch (format) {
        case "date":
          return "datefield";
        case "date-time":
        case "datetime":
          return "datetimefield";
        case "time":
          return "timefield";
        case "email":
        case "url":
        case "uri":
        case "tel":
        case "phone":
          return "formattedfield";
        case "password":
          return "passwordfield";
        case "uuid":
          return "uuidfield";
        case "color":
          return "colorfield";
        default:
          return "textfield";
      }
    }

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
        const fieldType = field.enum
          ? "select"
          : mapTypeWithFormat(field.type || "string", field.format);
        return {
          key,
          path: fullPath.join("."),
          type: fieldType,
          format: field.format,
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
                : [
                    {
                      key: "item",
                      path: [...fullPath, "0"].join("."),
                      type: field.items.enum
                        ? "select"
                        : mapTypeWithFormat(
                            field.items.type || "string",
                            field.items.format,
                          ),
                      format: field.items.format,
                      label: field.items.title || "Item",
                      description: field.items.description || "",
                      required: false,
                      enum: field.items.enum || null,
                      default: field.items.default,
                      rules: getRules(field.items),
                      minLength: field.items.minLength,
                      maxLength: field.items.maxLength,
                      minimum: field.items.minimum,
                      maximum: field.items.maximum,
                    },
                  ]
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
          (v?.length ?? 0) >= field.minLength ||
          `This field should be at least ${field.minLength} characters long`,
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
          (v?.length ?? 0) >= field.minItems ||
          `Minimum ${field.minItems} items required`,
      );
    }
    if (typeof field.maxItems === "number") {
      rules.push(
        (v: any[]) =>
          (v?.length ?? 0) <= field.maxItems ||
          `Maximum ${field.maxItems} items allowed`,
      );
    }

    if (field.format) {
      switch (field.format) {
        case "email":
          rules.push((v: string) => {
            if (!v) return true; // Let required validation handle empty values
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(v) || "Please enter a valid email address";
          });
          break;
        case "url":
        case "uri":
          rules.push((v: string) => {
            if (!v) return true;
            try {
              new URL(v);
              return true;
            } catch {
              return "Please enter a valid URL";
            }
          });
          break;
        case "date":
          rules.push((v: string) => {
            if (!v) return true;
            const date = new Date(v);
            return !isNaN(date.getTime()) || "Please enter a valid date";
          });
          break;
        case "date-time":
        case "datetime":
          rules.push((v: string) => {
            if (!v) return true;
            const date = new Date(v);
            return (
              !isNaN(date.getTime()) || "Please enter a valid date and time"
            );
          });
          break;
        case "time":
          rules.push((v: string) => {
            if (!v) return true;
            const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
            return timeRegex.test(v) || "Please enter a valid time (HH:MM)";
          });
          break;
        case "uuid":
          rules.push((v: string) => {
            if (!v) return true;
            const uuidRegex =
              /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            return uuidRegex.test(v) || "Please enter a valid UUID";
          });
          break;
        case "tel":
        case "phone":
          rules.push((v: string) => {
            if (!v) return true;
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            return (
              phoneRegex.test(v.replace(/[\s\-\(\)]/g, "")) ||
              "Please enter a valid phone number"
            );
          });
          break;
      }
    }

    return rules;
  };

  // Resolve all $refs in the schema before parsing
  const resolvedSchema = resolveAllRefs(schema, schema);
  
  const fields = computed(() => parseFields(resolvedSchema));

  const validate = (data: any) => (validator ? validator(data) : false);

  return { fields, validate };
}
