import { Box, Toolbar } from '@mui/material';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

function RootLayout({ children }: { children: React.ReactElement }) {
  return (
    <Box
      sx={{
        display: 'flex',
      }}
    >
      <Header />

      <Box
        component="main"
        sx={{
          flex: '1 1 auto',
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '100vh',
        }}
      >
        <div>
          <Toolbar sx={{ display: { xs: 'block', sm: 'none' } }} />

          {children}
        </div>
        <Footer />
      </Box>
    </Box>
  );
}

export default RootLayout;
