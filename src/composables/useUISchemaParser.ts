import type { UISchema, FieldWithUI, WidgetComponent } from '../types';

export function useUISchemaParser() {
  // Built-in widget registry
  const widgets: WidgetComponent[] = [
    {
      name: 'text',
      component: 'TextField',
      test: (_schema: any, uiSchema?: UISchema) => 
        _schema.type === 'string' && !_schema.format && !uiSchema?.['ui:widget']
    },
    {
      name: 'textarea',
      component: 'TextField',
      test: (_schema: any, uiSchema?: UISchema) => 
        uiSchema?.['ui:widget'] === 'textarea'
    },
    {
      name: 'password',
      component: 'PasswordField',
      test: (schema: any, uiSchema?: UISchema) => 
        schema.format === 'password' || uiSchema?.['ui:widget'] === 'password'
    },
    {
      name: 'email',
      component: 'FormattedField',
      test: (schema: any, uiSchema?: UISchema) => 
        schema.format === 'email' || uiSchema?.['ui:widget'] === 'email'
    },
    {
      name: 'url',
      component: 'FormattedField',
      test: (schema: any, uiSchema?: UISchema) => 
        schema.format === 'url' || schema.format === 'uri' || uiSchema?.['ui:widget'] === 'url'
    },
    {
      name: 'tel',
      component: 'FormattedField',
      test: (schema: any, uiSchema?: UISchema) => 
        schema.format === 'tel' || schema.format === 'phone' || uiSchema?.['ui:widget'] === 'tel'
    },
    {
      name: 'date',
      component: 'DateField',
      test: (schema: any, uiSchema?: UISchema) => 
        schema.format === 'date' || uiSchema?.['ui:widget'] === 'date'
    },
    {
      name: 'datetime',
      component: 'DateField',
      test: (schema: any, uiSchema?: UISchema) => 
        schema.format === 'date-time' || schema.format === 'datetime' || uiSchema?.['ui:widget'] === 'datetime'
    },
    {
      name: 'time',
      component: 'DateField',
      test: (schema: any, uiSchema?: UISchema) => 
        schema.format === 'time' || uiSchema?.['ui:widget'] === 'time'
    },
    {
      name: 'number',
      component: 'NumberField',
      test: (schema: any, uiSchema?: UISchema) => 
        (schema.type === 'number' || schema.type === 'integer') && !uiSchema?.['ui:widget']
    },
    {
      name: 'range',
      component: 'NumberField',
      test: (_schema: any, uiSchema?: UISchema) => 
        uiSchema?.['ui:widget'] === 'range'
    },
    {
      name: 'updown',
      component: 'NumberField',
      test: (_schema: any, uiSchema?: UISchema) => 
        uiSchema?.['ui:widget'] === 'updown'
    },
    {
      name: 'checkbox',
      component: 'CheckboxField',
      test: (schema: any, uiSchema?: UISchema) => 
        schema.type === 'boolean' && !uiSchema?.['ui:widget']
    },
    {
      name: 'radio',
      component: 'SelectField',
      test: (_schema: any, uiSchema?: UISchema) => 
        uiSchema?.['ui:widget'] === 'radio'
    },
    {
      name: 'select',
      component: 'SelectField',
      test: (schema: any, uiSchema?: UISchema) => 
        (schema.enum && !uiSchema?.['ui:widget']) || uiSchema?.['ui:widget'] === 'select'
    },
    {
      name: 'checkboxes',
      component: 'SelectField',
      test: (_schema: any, uiSchema?: UISchema) => 
        uiSchema?.['ui:widget'] === 'checkboxes'
    },
    {
      name: 'array',
      component: 'ArrayField',
      test: (schema: any, uiSchema?: UISchema) => 
        schema.type === 'array' && !uiSchema?.['ui:widget']
    },
    {
      name: 'hidden',
      component: 'TextField',
      test: (_schema: any, uiSchema?: UISchema) => 
        uiSchema?.['ui:widget'] === 'hidden'
    }
  ];

  /**
   * Parse UI schema and merge with JSON schema field
   */
  const parseUISchema = (
    field: any,
    uiSchema: UISchema = {},
    path: string[] = []
  ): FieldWithUI => {
    const fieldUISchema = getUISchemaForPath(uiSchema, path);

    // Determine widget based on schema and UI schema
    const widget = determineWidget(field, fieldUISchema);

    // Create enhanced field with UI properties
    const enhancedField: FieldWithUI = {
      ...field,
      ui: fieldUISchema,
      widget: widget.name,
      // Override with UI schema values
      label: fieldUISchema['ui:title'] || field.label,
      description: fieldUISchema['ui:description'] || field.description,
      placeholder: fieldUISchema['ui:placeholder'],
      help: fieldUISchema['ui:help'],
      hidden: fieldUISchema['ui:hidden'] || false,
      disabled: fieldUISchema['ui:disabled'] || false,
      readonly: fieldUISchema['ui:readonly'] || false,
      classNames: fieldUISchema['ui:classNames'],
      style: fieldUISchema['ui:style'],
    };

    // Process children for object fields
    if (field.children) {
      enhancedField.children = field.children.map((child: any) => 
        parseUISchema(child, uiSchema, [...path, child.key])
      );
    }

    // Process items for array fields
    if (field.items) {
      enhancedField.items = field.items.map((item: any) => 
        parseUISchema(item, uiSchema, [...path, 'items'])
      );
    }

    return enhancedField;
  };

  /**
   * Get UI schema for a specific field path
   */
  const getUISchemaForPath = (uiSchema: UISchema, path: string[]): UISchema => {
    let current = uiSchema;
    
    for (const segment of path) {
      if (current && typeof current === 'object' && segment in current) {
        current = current[segment] as UISchema;
      } else {
        return {};
      }
    }
    
    return current || {};
  };

  /**
   * Determine the appropriate widget for a field
   */
  const determineWidget = (schema: any, uiSchema: UISchema = {}): WidgetComponent => {
    // Try to find a matching widget
    for (const widget of widgets) {
      if (widget.test && widget.test(schema, uiSchema)) {
        return widget;
      }
    }

    // Fallback to text widget
    return widgets[0]; // text widget
  };

  /**
   * Register a custom widget
   */
  const registerWidget = (widget: WidgetComponent) => {
    // Remove existing widget with same name
    const existingIndex = widgets.findIndex(w => w.name === widget.name);
    if (existingIndex >= 0) {
      widgets.splice(existingIndex, 1);
    }
    
    // Add new widget at the beginning so it takes precedence
    widgets.unshift(widget);
  };

  /**
   * Get all registered widgets
   */
  const getWidgets = (): WidgetComponent[] => {
    return [...widgets];
  };

  /**
   * Process UI schema order for object fields
   */
  const processFieldOrder = (
    fields: FieldWithUI[],
    uiOrder?: string[]
  ): FieldWithUI[] => {
    if (!uiOrder || uiOrder.length === 0) {
      return fields;
    }

    const orderedFields: FieldWithUI[] = [];
    const fieldMap = new Map(fields.map(f => [f.key, f]));

    // Add fields in the specified order
    for (const key of uiOrder) {
      if (key === '*') {
        // Add remaining fields not yet added
        const remainingFields = fields.filter(f => 
          !orderedFields.some(of => of.key === f.key)
        );
        orderedFields.push(...remainingFields);
      } else if (fieldMap.has(key)) {
        orderedFields.push(fieldMap.get(key)!);
      }
    }

    // Add any fields not mentioned in the order
    const unorderedFields = fields.filter(f => 
      !orderedFields.some(of => of.key === f.key)
    );
    orderedFields.push(...unorderedFields);

    return orderedFields;
  };

  /**
   * Merge UI schema options with widget props
   */
  const mergeUIOptions = (
    baseProps: any,
    uiSchema: UISchema = {}
  ): any => {
    const options = uiSchema['ui:options'] || {};
    
    return {
      ...baseProps,
      ...options,
      // Special handling for common UI options
      placeholder: uiSchema['ui:placeholder'] || baseProps.placeholder,
      disabled: uiSchema['ui:disabled'] || baseProps.disabled,
      readonly: uiSchema['ui:readonly'] || baseProps.readonly,
      autofocus: uiSchema['ui:autofocus'] || false,
      autocomplete: uiSchema['ui:autocomplete'],
      help: uiSchema['ui:help'],
      classNames: uiSchema['ui:classNames'],
      style: uiSchema['ui:style'],
    };
  };

  /**
   * Convert JSON Schema enum to widget options
   */
  const processEnumOptions = (
    enumValues: any[],
    enumNames?: string[],
    enumDisabled?: any[]
  ) => {
    return enumValues.map((value, index) => ({
      label: enumNames?.[index] || String(value),
      value: value,
      disabled: enumDisabled?.includes(value) || false,
    }));
  };

  return {
    parseUISchema,
    getUISchemaForPath,
    determineWidget,
    registerWidget,
    getWidgets,
    processFieldOrder,
    mergeUIOptions,
    processEnumOptions,
  };
}