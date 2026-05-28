import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form';
import { Input } from './Input';
import type { TextInputProps } from 'react-native';

interface FormTextFieldProps<T extends FieldValues> extends Omit<TextInputProps, 'className' | 'style'> {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  className?: string;
}

export function FormTextField<T extends FieldValues>({
  control,
  name,
  label,
  className,
  ...textInputProps
}: FormTextFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <Input
          label={label}
          error={error?.message}
          className={className}
          onBlur={field.onBlur}
          onChangeText={field.onChange}
          value={field.value}
          {...textInputProps}
        />
      )}
    />
  );
}
