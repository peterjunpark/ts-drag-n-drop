export interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

export function validate(validatableInput: Validatable) {
  let isValid = true;

  const { value, required, minLength, maxLength, min, max } = validatableInput;

  if (required) {
    isValid = isValid && !!value.toString().trim().length;
  }

  if (minLength != null && typeof value === "string") {
    isValid = isValid && value.trim().length >= minLength;
  }

  if (maxLength != null && typeof value === "string") {
    isValid = isValid && value.trim().length <= maxLength;
  }

  if (min && typeof value === "number") {
    isValid = isValid && value >= min;
  }

  if (max && typeof value === "number") {
    isValid = isValid && value <= max;
  }
  return isValid;
}

// Method decorator
export function Autobind(
  _target: any,
  _methodName: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  const adjustedDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };
  return adjustedDescriptor;
}
