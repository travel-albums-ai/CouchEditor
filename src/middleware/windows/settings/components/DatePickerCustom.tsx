import { TextField, TextFieldProps } from '@mui/material';
import { useEffect, useState } from 'react';

type DatePickerCustomProps = Omit<
  TextFieldProps,
  'type' | 'value' | 'onChange'
> & {
  value: number;
  onChange: (newValue: number) => void;
};

export default function DatePickerCustom({
  value,
  onChange,
  ...props
}: DatePickerCustomProps) {
  const [localValue, setLocalValue] = useState(
    value ? timestampToDateString(value) : ''
  );

  useEffect(() => {
    setLocalValue(value ? timestampToDateString(value) : '');
  }, [value]);

  return (
    <TextField
      {...props}
      type="date"
      value={localValue}
      onChange={(event) => {
        const dateString = event.target.value;

        setLocalValue(dateString);

        const newValue = dateString
          ? dateStringToTimestamp(dateString)
          : 0;

        if (newValue !== value) {
          onChange(newValue);
        }
      }}
    />
  );
}

function timestampToDateString(timestamp: number): string {
  const date = new Date(timestamp);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function dateStringToTimestamp(value: string): number {
  const [year, month, day] = value.split('-').map(Number);

  return new Date(year, month - 1, day).getTime();
}
