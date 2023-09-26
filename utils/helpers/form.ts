// Types
import type { UseFormReturnType } from '@mantine/form';

export const validatePassword = (password: string) => {
  return [
    password.length >= 8,
    /[A-Z]/.test(password), // Contain at least 1 uppercase
    /[a-z]/.test(password), // Contain at least 1 lowercase
    /\d/.test(password), // Contain at least 1 number
    /[$&+,:;=?@#|'<>.^*()%!-]/.test(password) // Contain at least 1 special character
  ];
};

export const getValidPasswordConditions = (form: UseFormReturnType<any>) => {
  return validatePassword(form.getInputProps('password').value).filter((condition) => condition);
};