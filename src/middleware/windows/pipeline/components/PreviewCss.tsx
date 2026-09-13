import { PreviewBeforeAfter } from '@/middleware/windows/pipeline/components/PreviewBeforeAfter';
import { useTheme } from '@mui/material';

export function PreviewCss({ image2style, data }: { image2style: React.CSSProperties, data: Record<string, any> }) {
  const theme = useTheme();
  return  <>
    <PreviewBeforeAfter
      after={<img src="sample.jpg" style={{ maxWidth: '90px', borderRadius: '8px', border: `1px solid ${theme.palette.divider}`, ...image2style }} />}
      value={data ? Object.values(data)?.[0] : 0}
    />
  </>;
};
