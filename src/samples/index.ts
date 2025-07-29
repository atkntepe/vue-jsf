// Sample JSON schemas for testing
import simplePersonSchema from './simple-person.json';
import complexObjectSchema from './complex-object.json';
import withRefsSchema from './with-refs.json';
import formFieldsSchema from './form-fields.json';
import conditionalValidationSchema from './conditional-validation.json';
import dependentValidationSchema from './dependent-validation.json';
import schemaCompositionSchema from './schema-composition.json';
import advancedPatternsSchema from './advanced-patterns.json';
import fileUploadSchema from './file-upload.json';
import formStateSchema from './form-state.json';
import richTextEditorSchema from './rich-text-editor.json';

export interface SampleSchema {
  name: string;
  description: string;
  schema: any;
}

export const sampleSchemas: SampleSchema[] = [
  {
    name: "Simple Person",
    description: "Basic form with name, age, email",
    schema: simplePersonSchema
  },
  {
    name: "Complex Object", 
    description: "Nested objects and arrays",
    schema: complexObjectSchema
  },
  {
    name: "With $refs",
    description: "Schema using references",
    schema: withRefsSchema
  },
  {
    name: "Form Fields",
    description: "Various input types",
    schema: formFieldsSchema
  },
  {
    name: "Conditional Validation",
    description: "if/then/else conditions",
    schema: conditionalValidationSchema
  },
  {
    name: "Dependent Validation",
    description: "dependentRequired/dependentSchemas",
    schema: dependentValidationSchema
  },
  {
    name: "Schema Composition",
    description: "oneOf/anyOf examples",
    schema: schemaCompositionSchema
  },
  {
    name: "Advanced Patterns",
    description: "Mixed enums, regex patterns",
    schema: advancedPatternsSchema
  },
  {
    name: "File Upload",
    description: "File upload fields with validation",
    schema: fileUploadSchema
  },
  {
    name: "Form State Management", 
    description: "Test form state tracking and management",
    schema: {
      ...formStateSchema,
      uiSchema: {
        "bio": {
          "ui:widget": "textarea",
          "ui:placeholder": "Tell us about yourself..."
        },
        "password": {
          "ui:help": "Password must be at least 8 characters"
        },
        "confirmPassword": {
          "ui:help": "Must match your password"
        },
        "skills": {
          "ui:help": "Select 1-5 skills that represent your expertise"
        },
        "terms": {
          "ui:help": "Required to proceed with registration"
        },
        "newsletter": {
          "ui:help": "We respect your privacy"
        },
        "ui:order": [
          "firstName",
          "lastName", 
          "email",
          "age",
          "phone",
          "website",
          "password",
          "confirmPassword",
          "country",
          "skills", 
          "experience",
          "newsletter",
          "terms",
          "bio",
          "avatar",
          "documents"
        ]
      }
    }
  },
  {
    name: "Rich Text Editor",
    description: "Test rich text editing with different toolbar configurations",
    schema: richTextEditorSchema
  }
];

export {
  simplePersonSchema,
  complexObjectSchema,
  withRefsSchema,
  formFieldsSchema,
  conditionalValidationSchema,
  dependentValidationSchema,
  schemaCompositionSchema,
  advancedPatternsSchema,
  fileUploadSchema,
  formStateSchema,
  richTextEditorSchema
};