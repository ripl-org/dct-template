import { Box } from '@mui/material';

export default function OffsetHashedSection(props: { id: string; children: React.ReactNode }) {
  return (
    <Box id={props.id} component="section" sx={{ pt: { xs: 20, md: 13 }, mt: { xs: -20, md: -13 } }}>
      {props.children}
    </Box>
  );
}
