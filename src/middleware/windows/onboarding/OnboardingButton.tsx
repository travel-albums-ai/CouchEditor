import { Button } from '@mui/material';
import { ExternalLink } from 'lucide-react';

export default function OnboardingButton({ href, label }: { href: string, label: string }) {

  return (<>
    <a href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', width: '100%' }}>
      <Button variant="contained" color="primary" fullWidth>
        <ExternalLink size={16} style={{ marginRight: 8 }} />
        {label}
      </Button>
    </a>
  </>)
}
