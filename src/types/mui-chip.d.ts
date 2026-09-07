import '@mui/material/Chip'
import '@mui/material/Chip/Chip'

declare module '@mui/material/Chip' {
  interface ChipPropsVariantOverrides {
    important: true
  }
}

declare module '@mui/material/Chip/Chip' {
  interface ChipPropsVariantOverrides {
    important: true
  }
}
