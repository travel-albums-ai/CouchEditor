import { useDescriptions } from '@/context/descriptionsStore';
import { Box, TextField } from '@mui/material';

export default function DescribePhoto({ photoId }: { photoId: string }) {
  const { describePhoto, getDescription } = useDescriptions()
  const currentDescription = getDescription(photoId);

  return (
    <Box>
      <TextField
        fullWidth
        placeholder="Add a description... (or let AI generate one for you)"
        multiline
        minRows={3}
        value={currentDescription}
        onChange={(e) => describePhoto(photoId, e.target.value)}
      />
    </Box>
  )
}
