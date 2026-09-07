import '@mui/material/TextField';

declare module '@mui/material/TextField' {
  interface TextFieldProps {
    roundness?: 'full' | 'rounded' | 'square';
  }
}
