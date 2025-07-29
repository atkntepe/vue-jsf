export interface UISchema {
  "ui:widget"?: string;
  "ui:options"?: Record<string, any>;
  "ui:order"?: string[];
  "ui:title"?: string;
  "ui:description"?: string;
  "ui:placeholder"?: string;
  "ui:help"?: string;
  "ui:disabled"?: boolean;
  "ui:readonly"?: boolean;
  "ui:hidden"?: boolean;
  "ui:classNames"?: string | string[];
  "ui:style"?: Record<string, any>;
  "ui:autofocus"?: boolean;
  "ui:autocomplete"?: string;
  "ui:emptyValue"?: any;
  "ui:enumDisabled"?: any[];
  "ui:enumNames"?: string[];
  // Field-specific UI options
  "ui:field"?: string;
  // Widget-specific options
  "ui:submitButtonOptions"?: {
    submitText?: string;
    norender?: boolean;
    props?: Record<string, any>;
  };
  // For objects and arrays
  [key: string]: UISchema | any;
}

export interface UISchemaProperty extends UISchema {
  // Additional properties specific to field-level UI schema
}

export interface WidgetProps {
  id: string;
  label: string;
  value: any;
  required: boolean;
  disabled: boolean;
  readonly: boolean;
  placeholder?: string;
  multiple?: boolean;
  options?: {
    enumOptions?: Array<{ label: string; value: any }>;
    inline?: boolean;
    rows?: number;
    cols?: number;
    [key: string]: any;
  };
  schema: any;
  uiSchema: UISchema;
  onChange: (value: any) => void;
  onBlur?: (id: string, value: any) => void;
  onFocus?: (id: string, value: any) => void;
  rawErrors?: string[];
  formContext?: any;
}

export interface WidgetComponent {
  name: string;
  component: any;
  test?: (schema: any, uiSchema?: UISchema) => boolean;
}

// Extended Field interface to include UI schema
export interface FieldWithUI {
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
  children?: FieldWithUI[];
  items?: FieldWithUI[];
  pattern?: string;
  mask?: string;
  maxSize?: number;
  accept?: string;
  conditional?: {
    if: any;
    then?: any;
    else?: any;
  };
  oneOf?: FieldWithUI[][];
  anyOf?: FieldWithUI[][];
  allOf?: FieldWithUI[][];
  dependentRequired?: Record<string, string[]>;
  dependentSchemas?: Record<string, any>;
  // UI Schema properties
  ui?: UISchema;
  widget?: string;
  placeholder?: string;
  help?: string;
  hidden?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  classNames?: string | string[];
  style?: Record<string, any>;
}