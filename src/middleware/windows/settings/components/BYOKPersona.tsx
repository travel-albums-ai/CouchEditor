import { useBYOK } from '@/context/byokStore';
import { Box, Button, InputAdornment, TextField } from '@mui/material';
import { PersonStanding, Plus, TextAlignStart, Trash } from 'lucide-react';

export default function BYOKPersona({ persona, main = false, index }: { persona: any, main?: boolean, index: number }) {
  const { setMainPersona, updateAdditionalPersona, removeAdditionalPersona } = useBYOK()

  return <>
    <Box key={index} sx={{ display: 'flex', alignItems: 'stretch', gap: 1, mt: 1 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'stretch', gap: 1, flexGrow: 1 }}>
          <TextField
            fullWidth
            placeholder="Name this persona..."
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    {main ? <PersonStanding size={16} /> : <Plus size={16} />}
                  </InputAdornment>
                ),
              },
            }}
            value={persona.name} size="small" onChange={(e) =>
              main ? setMainPersona({ ...persona, name: e.target.value }) : updateAdditionalPersona(index, { ...persona, name: e.target.value })
            } />
          {!main && <Button variant="outlined" color="error" onClick={() => removeAdditionalPersona(index)}><Trash size={16} /></Button>}
        </Box>
        <TextField
          placeholder={'Lightly describe visually...'}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <TextAlignStart size={16} />
                </InputAdornment>
              ),
            },
          }}
          value={persona.description} size="small" onChange={(e) =>
            main ? setMainPersona({ ...persona, description: e.target.value }) : updateAdditionalPersona(index, { ...persona, description: e.target.value })
          } />
      </Box>
    </Box>
  </>
}
