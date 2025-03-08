import { Box, Container } from '@mui/material';

export default function InsetBoxContainer(props: { children: React.ReactNode }) {
  return (
    <Box sx={{ px: { xs: 0, md: 12 } }}>
      <Container maxWidth={false}>{props.children}</Container>
    </Box>
  );
}
