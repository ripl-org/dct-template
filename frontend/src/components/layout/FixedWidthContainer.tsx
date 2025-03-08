import { Box, type BoxProps, styled } from '@mui/material';

const FixedWidthContainer = styled(Box)<BoxProps>(({ theme }) => ({
  padding: theme.spacing(0, 2),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(0, 3),
  },
  maxWidth: 1200,
}));

export default FixedWidthContainer;
