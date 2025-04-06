import { NumericFormat } from 'react-number-format';
import { TextField } from '@mui/material';

export default function NumericFormatCustom({ field, ...props }) {
  return (
    <NumericFormat
      {...field}
      {...props}
      customInput={TextField}
      thousandSeparator="."
      decimalSeparator=","
      prefix="Rp "
      allowNegative={false}
      onValueChange={(values) => {
        field.onChange(values.floatValue || 0); // Kirim angka murni ke form
      }}
    />
  );
}
