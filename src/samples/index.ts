// Sample JSON schemas for testing
import simplePersonSchema from './simple-person.json';
import complexObjectSchema from './complex-object.json';
import withRefsSchema from './with-refs.json';
import formFieldsSchema from './form-fields.json';

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
  }
];

export {
  simplePersonSchema,
  complexObjectSchema,
  withRefsSchema,
  formFieldsSchema
};