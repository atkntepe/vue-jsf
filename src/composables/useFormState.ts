import { ref, computed, reactive } from 'vue';

export interface FormState {
  isDirty: boolean;
  isPristine: boolean;
  isTouched: boolean;
  isValid: boolean;
  errors: Record<string, string[]>;
}

export interface FieldState {
  isDirty: boolean;
  isPristine: boolean;
  isTouched: boolean;
  isValid: boolean;
  errors: string[];
  value: any;
  initialValue: any;
}

export function useFormState(initialData: any = {}) {
  // Store initial form data for pristine/dirty comparison
  const safeInitialData = initialData ?? {};
  const initialFormData = ref(JSON.parse(JSON.stringify(safeInitialData)));
  const currentFormData = ref(JSON.parse(JSON.stringify(safeInitialData)));
  
  // Field-level state tracking
  const fieldStates = reactive<Record<string, FieldState>>({});
  const touchedFields = reactive<Set<string>>(new Set());
  
  // Form-level validation errors
  const formErrors = ref<Record<string, string[]>>({});
  
  // Initialize field states
  const initializeField = (path: string, value: any) => {
    if (!fieldStates[path]) {
      // Safe handling of undefined/null values
      const safeValue = value ?? null;
      const safeInitialValue = safeValue !== null 
        ? JSON.parse(JSON.stringify(safeValue))
        : null;
        
      fieldStates[path] = {
        isDirty: false,
        isPristine: true,
        isTouched: false,
        isValid: true,
        errors: [],
        value: safeValue,
        initialValue: safeInitialValue
      };
    }
  };
  
  // Update field value and state
  const updateField = (path: string, value: any, errors: any[] = []) => {
    // Initialize field if it doesn't exist
    initializeField(path, fieldStates[path]?.initialValue ?? value);
    
    const fieldState = fieldStates[path];
    fieldState.value = value;
    fieldState.errors = errors.map((error: any) => error.$message || error.message || String(error));
    fieldState.isValid = errors.length === 0;
    
    // Check if field is dirty (different from initial value)
    const safeValue = value ?? null;
    fieldState.isDirty = !deepEqual(safeValue, fieldState.initialValue);
    fieldState.isPristine = !fieldState.isDirty;
    
    // Update current form data
    setNestedValue(currentFormData.value, path, value);
    
    // Update form-level errors
    if (fieldState.errors.length > 0) {
      formErrors.value[path] = fieldState.errors;
    } else {
      delete formErrors.value[path];
    }
  };
  
  // Mark field as touched
  const touchField = (path: string) => {
    touchedFields.add(path);
    if (fieldStates[path]) {
      fieldStates[path].isTouched = true;
    }
  };
  
  // Reset form to initial state
  const resetForm = (newInitialData?: any) => {
    const resetData = newInitialData ?? initialFormData.value ?? {};
    
    // Update initial data if provided
    if (newInitialData) {
      const safeNewData = newInitialData ?? {};
      initialFormData.value = JSON.parse(JSON.stringify(safeNewData));
    }
    
    // Reset current form data
    const safeResetData = resetData ?? {};
    currentFormData.value = JSON.parse(JSON.stringify(safeResetData));
    
    // Reset field states
    Object.keys(fieldStates).forEach(path => {
      const initialValue = getNestedValue(resetData, path);
      const safeInitialValue = initialValue ?? null;
      const safeInitialValueCopy = safeInitialValue !== null 
        ? JSON.parse(JSON.stringify(safeInitialValue))
        : null;
        
      fieldStates[path] = {
        isDirty: false,
        isPristine: true,
        isTouched: false,
        isValid: true,
        errors: [],
        value: safeInitialValue,
        initialValue: safeInitialValueCopy
      };
    });
    
    // Reset touched fields
    touchedFields.clear();
    
    // Reset form errors
    formErrors.value = {};
  };
  
  // Reset field to initial state
  const resetField = (path: string) => {
    if (fieldStates[path]) {
      const initialValue = fieldStates[path].initialValue;
      const safeInitialValue = initialValue !== null 
        ? JSON.parse(JSON.stringify(initialValue))
        : null;
      updateField(path, safeInitialValue, []);
      touchedFields.delete(path);
      fieldStates[path].isTouched = false;
    }
  };
  
  // Computed form state
  const formState = computed<FormState>(() => {
    const fieldStateValues = Object.values(fieldStates);
    
    return {
      isDirty: fieldStateValues.some(field => field.isDirty) || !deepEqual(currentFormData.value, initialFormData.value),
      isPristine: fieldStateValues.every(field => field.isPristine) && deepEqual(currentFormData.value, initialFormData.value),
      isTouched: touchedFields.size > 0,
      isValid: fieldStateValues.every(field => field.isValid) && Object.keys(formErrors.value).length === 0,
      errors: { ...formErrors.value }
    };
  });
  
  // Get specific field state
  const getFieldState = (path: string): FieldState | null => {
    return fieldStates[path] || null;
  };
  
  // Check if specific field is dirty
  const isFieldDirty = (path: string): boolean => {
    return fieldStates[path]?.isDirty ?? false;
  };
  
  // Check if specific field is touched
  const isFieldTouched = (path: string): boolean => {
    return touchedFields.has(path);
  };
  
  // Get dirty fields
  const getDirtyFields = (): Record<string, any> => {
    const dirtyFields: Record<string, any> = {};
    Object.entries(fieldStates).forEach(([path, state]) => {
      if (state.isDirty) {
        dirtyFields[path] = state.value;
      }
    });
    return dirtyFields;
  };
  
  // Get changed values only
  const getChangedValues = (): any => {
    const changed: any = {};
    Object.entries(fieldStates).forEach(([path, state]) => {
      if (state.isDirty) {
        setNestedValue(changed, path, state.value);
      }
    });
    return changed;
  };
  
  return {
    // State
    formState,
    fieldStates: fieldStates as Record<string, FieldState>,
    currentFormData,
    initialFormData,
    
    // Methods
    updateField,
    touchField,
    resetForm,
    resetField,
    initializeField,
    getFieldState,
    isFieldDirty,
    isFieldTouched,
    getDirtyFields,
    getChangedValues
  };
}

// Utility functions
function deepEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true;
  
  if (obj1 == null || obj2 == null) return obj1 === obj2;
  
  if (typeof obj1 !== typeof obj2) return false;
  
  if (typeof obj1 !== 'object') return obj1 === obj2;
  
  if (Array.isArray(obj1) !== Array.isArray(obj2)) return false;
  
  if (Array.isArray(obj1)) {
    if (obj1.length !== obj2.length) return false;
    for (let i = 0; i < obj1.length; i++) {
      if (!deepEqual(obj1[i], obj2[i])) return false;
    }
    return true;
  }
  
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  if (keys1.length !== keys2.length) return false;
  
  for (const key of keys1) {
    if (!keys2.includes(key)) return false;
    if (!deepEqual(obj1[key], obj2[key])) return false;
  }
  
  return true;
}

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => {
    if (current == null) return undefined;
    if (Array.isArray(current) && /^\d+$/.test(key)) {
      return current[parseInt(key)];
    }
    return current[key];
  }, obj);
}

function setNestedValue(obj: any, path: string, value: any): void {
  const keys = path.split('.');
  let current = obj;
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const nextKey = keys[i + 1];
    
    if (current[key] == null) {
      // Create array if next key is numeric, otherwise create object
      current[key] = /^\d+$/.test(nextKey) ? [] : {};
    }
    
    current = current[key];
  }
  
  const finalKey = keys[keys.length - 1];
  if (Array.isArray(current) && /^\d+$/.test(finalKey)) {
    const index = parseInt(finalKey);
    // Ensure array is large enough
    while (current.length <= index) {
      current.push(undefined);
    }
  }
  
  current[finalKey] = value;
}