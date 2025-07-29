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
  enum?: any[] | null;
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
  // Pattern and mask
  pattern?: string;
  mask?: string;
  // File upload specific properties
  maxSize?: number;
  accept?: string;
  // Conditional validation
  conditional?: {
    if: any;
    then?: any;
    else?: any;
  };
  // Schema composition
  oneOf?: Field[][];
  anyOf?: Field[][];
  allOf?: Field[][];
  // Dependent validation
  dependentRequired?: Record<string, string[]>;
  dependentSchemas?: Record<string, any>;
}

export function useSchemaParser(schema: any) {
  const ajv = new Ajv({ 
    allErrors: true,
    validateSchema: false, // Disable meta-schema validation to avoid draft version conflicts
    strict: false // Be more lenient with unknown keywords
  });
  addFormats(ajv);

  ajv.addFormat("tel", /^[\+]?[1-9][\d]{0,15}$/);
  ajv.addFormat("file", true); // Accept any value for file format
  ajv.addFormat("binary", true); // Accept any value for binary format

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

  // Handle conditional validation (if/then/else)
  const processConditionalSchema = (schema: any, formData: any = {}): any => {
    if (!schema.if) return schema;

    const conditionMet = evaluateCondition(schema.if, formData);
    
    if (conditionMet && schema.then) {
      return mergeSchemas(schema, schema.then);
    } else if (!conditionMet && schema.else) {
      return mergeSchemas(schema, schema.else);
    }
    
    return schema;
  };

  // Evaluate if condition against form data
  const evaluateCondition = (condition: any, formData: any): boolean => {
    if (!condition || !condition.properties) return false;

    return Object.entries(condition.properties).every(([key, value]: [string, any]) => {
      const fieldValue = formData[key];
      
      if (value.const !== undefined) {
        return fieldValue === value.const;
      }
      
      if (value.enum !== undefined) {
        return value.enum.includes(fieldValue);
      }
      
      // Add more condition types as needed
      return true;
    });
  };

  // Merge schemas for conditional validation
  const mergeSchemas = (base: any, override: any): any => {
    const merged = { ...base };
    
    if (override.properties) {
      merged.properties = { ...merged.properties };
      
      // Deep merge properties to preserve existing field properties while adding new ones
      Object.entries(override.properties).forEach(([key, overrideField]: [string, any]) => {
        if (merged.properties[key]) {
          // Merge field properties deeply
          merged.properties[key] = {
            ...merged.properties[key],
            ...overrideField
          };
        } else {
          merged.properties[key] = overrideField;
        }
      });
    }
    
    if (override.required) {
      merged.required = [...(merged.required || []), ...override.required];
    }
    
    // Merge other schema-level properties
    ['minProperties', 'maxProperties', 'additionalProperties', 'patternProperties'].forEach(prop => {
      if (override[prop] !== undefined) {
        merged[prop] = override[prop];
      }
    });
    
    return merged;
  };


  // Handle dependent validation
  const processDependentValidation = (schema: any, formData: any = {}): any => {
    let processedSchema = { ...schema };
    
    // Handle dependentRequired
    if (schema.dependentRequired) {
      Object.entries(schema.dependentRequired).forEach(([triggerField, requiredFields]) => {
        const fields = requiredFields as string[];
        if (formData[triggerField] !== undefined && formData[triggerField] !== null && formData[triggerField] !== '') {
          processedSchema.required = [...(processedSchema.required || []), ...fields];
        }
      });
    }
    
    // Handle dependentSchemas
    if (schema.dependentSchemas) {
      Object.entries(schema.dependentSchemas).forEach(([triggerField, dependentSchema]) => {
        if (formData[triggerField] !== undefined && formData[triggerField] !== null && formData[triggerField] !== '') {
          processedSchema = mergeSchemas(processedSchema, dependentSchema);
        }
      });
    }
    
    return processedSchema;
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
        case "binary":
        case "file":
          return "fileupload";
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

  const parseFields = (subSchema: any, path: string[] = [], formData: any = {}): Field[] => {
    if (subSchema.type !== "object" || !subSchema.properties) return [];

    // Process conditional and dependent validation at schema level
    let processedSchema = subSchema;
    if (subSchema.if || subSchema.dependentRequired || subSchema.dependentSchemas) {
      processedSchema = processConditionalSchema(subSchema, formData);
      processedSchema = processDependentValidation(processedSchema, formData);
    }

    return Object.entries(processedSchema.properties).map(
      ([key, field]: [string, any]) => {
        const fullPath = [...path, key];
        
        // Check if this field is a composition (oneOf/anyOf/allOf) at the root level
        if (field.oneOf || field.anyOf || field.allOf) {
          const baseField: Field = {
            key,
            path: fullPath.join("."),
            type: "composition", // Special type for compositions
            format: field.format,
            label: field.title || key.charAt(0).toUpperCase() + key.slice(1),
            description: field.description || "",
            required: (processedSchema.required || []).includes(key),
            enum: null,
            default: field.default,
            rules: [],
            minLength: field.minLength,
            maxLength: field.maxLength,
            minimum: field.minimum,
            maximum: field.maximum,
            minItems: field.minItems,
            maxItems: field.maxItems,
          };
          
          // Store the raw schema objects for composition, not parsed fields
          if (field.oneOf) {
            baseField.oneOf = field.oneOf;
          }
          if (field.anyOf) {
            baseField.anyOf = field.anyOf;
          }
          
          return baseField;
        }
        
        // Determine field type with focused debugging for skills field
        let fieldType;
        if (field.type === "array" && field.items?.enum) {
          fieldType = "multiselect";
          if (key === "skills" || key === "interests") {
            console.log(`🎯 MULTISELECT DETECTED - ${key}:`, { 
              type: field.type, 
              hasItems: !!field.items, 
              hasEnum: !!field.items?.enum,
              enumOptions: field.items.enum,
              resultType: fieldType
            });
          }
        } else if (field.enum) {
          fieldType = "select";
          if (key === "skills" || key === "interests") {
            console.log(`📋 SELECT DETECTED - ${key}:`, { 
              type: field.type, 
              enum: field.enum,
              resultType: fieldType
            });
          }
        } else if (field.const !== undefined) {
          fieldType = "readonly";
        } else if (field.pattern && getInputMask(field.pattern)) {
          fieldType = "formattedfield";
        } else {
          fieldType = mapTypeWithFormat(field.type || "string", field.format);
        }
        const baseField: Field = {
          key,
          path: fullPath.join("."),
          type: fieldType,
          format: field.format,
          label: field.title || key.charAt(0).toUpperCase() + key.slice(1),
          description: field.description || "",
          required: (processedSchema.required || []).includes(key),
          enum: field.enum || (field.type === "array" && field.items?.enum ? field.items.enum : null),
          default: field.default,
          rules: getRules(field),
          minLength: field.minLength,
          maxLength: field.maxLength,
          minimum: field.minimum,
          maximum: field.maximum,
          minItems: field.minItems,
          maxItems: field.maxItems,
          pattern: field.pattern,
          mask: field.pattern ? getInputMask(field.pattern) || undefined : undefined,
          maxSize: field.maxSize,
          accept: field.accept,
          children:
            field.type === "object" ? parseFields(field, fullPath, formData) : undefined,
          items:
            field.type === "array" && field.items
              ? field.items.type === "object"
                ? parseFields(field.items, [...fullPath, "0"], formData)
                : [
                    {
                      key: "item",
                      path: fullPath.join("."),
                      type: field.items.enum
                        ? "select"
                        : field.items.pattern && getInputMask(field.items.pattern)
                        ? "formattedfield"
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
                      pattern: field.items.pattern,
                      mask: field.items.pattern ? getInputMask(field.items.pattern) || undefined : undefined,
                      maxSize: field.items.maxSize,
                      accept: field.items.accept,
                    },
                  ]
              : undefined,
        };

        // Add conditional validation
        if (field.if && (field.then || field.else)) {
          baseField.conditional = {
            if: field.if,
            then: field.then,
            else: field.else
          };
        }

        // Add schema composition - store raw schemas, not parsed fields
        if (field.oneOf) {
          baseField.oneOf = field.oneOf;
          baseField.type = "composition";
        }
        if (field.anyOf) {
          baseField.anyOf = field.anyOf;
          baseField.type = "composition";
        }
        if (field.allOf) {
          baseField.allOf = field.allOf;
        }

        // Add dependent validation properties from root schema
        if (processedSchema.dependentRequired) {
          baseField.dependentRequired = processedSchema.dependentRequired;
        }
        if (processedSchema.dependentSchemas) {
          baseField.dependentSchemas = processedSchema.dependentSchemas;
        }

        return baseField;
      },
    );
  };

  // Convert JSON Schema patterns to input masks
  const getInputMask = (pattern: string): string | null => {
    const patternToMask: Record<string, string> = {
      // US ZIP codes: 12345 or 12345-6789
      '^[0-9]{5}(?:-[0-9]{4})?$': '99999-9999',
      // Canadian postal: A1A 1A1
      '^[A-Z][0-9][A-Z] [0-9][A-Z][0-9]$': 'A9A 9A9',
      // Product ID: AB1234
      '^[A-Z]{2}\\d{4}$': 'AA9999',
      // Phone number patterns
      '^[+]?[1-9]\\d{1,14}$': '+999999999999999',
      '^\\([0-9]{3}\\) [0-9]{3}-[0-9]{4}$': '(999) 999-9999',
      // Credit card: 1234 5678 9012 3456
      '^[0-9]{4} [0-9]{4} [0-9]{4} [0-9]{4}$': '9999 9999 9999 9999',
      // Social Security: 123-45-6789
      '^[0-9]{3}-[0-9]{2}-[0-9]{4}$': '999-99-9999',
      // Date formats
      '^[0-9]{2}/[0-9]{2}/[0-9]{4}$': '99/99/9999',
      '^[0-9]{4}-[0-9]{2}-[0-9]{2}$': '9999-99-99',
      // Time formats
      '^[0-9]{2}:[0-9]{2}$': '99:99',
      '^[0-9]{2}:[0-9]{2}:[0-9]{2}$': '99:99:99',
    };
    
    // Check for exact matches first
    if (patternToMask[pattern]) {
      return patternToMask[pattern];
    }
    
    // Try to auto-convert simple patterns
    return convertPatternToMask(pattern);
  };

  // Auto-convert simple regex patterns to masks
  const convertPatternToMask = (pattern: string): string | null => {
    // Remove anchors
    let cleanPattern = pattern.replace(/^\^|\$$/g, '');
    
    // Convert common regex elements to mask characters
    let mask = cleanPattern
      .replace(/\\d\{(\d+)\}/g, (_, count) => '9'.repeat(parseInt(count))) // \d{4} → 9999
      .replace(/\\d/g, '9') // \d → 9
      .replace(/\[0-9\]\{(\d+)\}/g, (_, count) => '9'.repeat(parseInt(count))) // [0-9]{4} → 9999
      .replace(/\[0-9\]/g, '9') // [0-9] → 9
      .replace(/\[A-Z\]\{(\d+)\}/g, (_, count) => 'A'.repeat(parseInt(count))) // [A-Z]{2} → AA
      .replace(/\[A-Z\]/g, 'A') // [A-Z] → A
      .replace(/\[a-z\]\{(\d+)\}/g, (_, count) => 'a'.repeat(parseInt(count))) // [a-z]{2} → aa
      .replace(/\[a-z\]/g, 'a') // [a-z] → a
      .replace(/\[A-Za-z\]/g, 'A') // [A-Za-z] → A
      .replace(/\./g, '*') // . → * (any character)
      .replace(/\+/g, '') // Remove + quantifiers
      .replace(/\*/g, '') // Remove * quantifiers
      .replace(/\?/g, '') // Remove ? quantifiers
      .replace(/[()]/g, '') // Remove grouping
      .replace(/\|/g, '') // Remove alternation
      .replace(/\\/g, ''); // Remove remaining escapes
    
    // If the mask only contains valid mask characters and literals, return it
    if (/^[9AaS*\s\-\/\.,:()]+$/.test(mask) && mask.length > 0 && mask.length < 50) {
      return mask;
    }
    
    return null;
  };

  // Get user-friendly pattern descriptions
  const getPatternDescription = (pattern: string): string => {
    const commonPatterns: Record<string, string> = {
      '^[0-9]{5}(?:-[0-9]{4})?$': 'Expected format: 12345 or 12345-6789 (US ZIP code)',
      '^[A-Z][0-9][A-Z] [0-9][A-Z][0-9]$': 'Expected format: A1A 1A1 (Canadian postal code)',
      '^[A-Z]{2}\\d{4}$': 'Expected format: 2 uppercase letters followed by 4 digits (e.g., AB1234)',
      '^[a-z]+$': 'Only lowercase letters allowed',
      '^[+]?[1-9]\\d{1,14}$': 'Valid phone number format',
    };
    
    return commonPatterns[pattern] || `Must match pattern: ${pattern}`;
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
    if (field.pattern) {
      const patternDescription = getPatternDescription(field.pattern);
      rules.push(
        (v: string) => {
          if (!v) return true; // Let required validation handle empty values
          return new RegExp(field.pattern).test(v) || `Invalid format. ${patternDescription}`;
        }
      );
    }
    
    if (field.const !== undefined) {
      rules.push(
        (v: any) => v === field.const || `Value must be exactly: ${field.const}`
      );
    }
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
  
  // Function to parse fields with current form data for dynamic updates
  const parseFieldsWithData = (formData: any) => {
    return parseFields(resolvedSchema, [], formData);
  };

  const validate = (data: any) => (validator ? validator(data) : false);

  return { fields, validate, parseFieldsWithData };
}
