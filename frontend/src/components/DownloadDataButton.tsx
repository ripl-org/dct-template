import { USE_OF_FORCE_FORMATTED_DATA_LAST_UPDATED_DATE } from '@/constants/useOfForce';
import useDownloadFile from '@/hooks/useDownloadFile';
import { sendEvent } from '@/lib/gtag';
import { Close, Download } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  styled,
} from '@mui/material';
import { useState } from 'react';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

function DownloadDataButton(props: { filename: string; dataCategory: string; year: string }) {
  const { loading, error, downloadFile } = useDownloadFile();

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
    sendEvent('download_data');
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleDownload = () => {
    downloadFile(props.filename);
    sendEvent('download_data_dialog');
  };
  return (
    <>
      <Button
        onClick={handleClickOpen}
        variant="text"
        color="inherit"
        sx={{
          textTransform: 'none',
          fontSize: '16px',
          fontWeight: 'regular',
          '&:hover': {
            backgroundColor: 'transparent',
          },
        }}
        endIcon={<Download />}
        focusRipple={true}
      >
        Download data
      </Button>

      {/* TODO: Import dialog dinamicly */}
      <BootstrapDialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ m: 0, p: 2, fontWeight: 'bold' }}>Download data</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'white',
          }}
        >
          <Close />
        </IconButton>

        <DialogContent dividers>
          {error && (
            <Alert sx={{ mb: 2 }} severity="error">
              {error}
            </Alert>
          )}
          <Typography paragraph>
            {props.dataCategory === 'Use of Force'
              ? `Use of Force data from January 1, 2020 to ${USE_OF_FORCE_FORMATTED_DATA_LAST_UPDATED_DATE} is available to download in a .csv format.`
              : `${props.dataCategory} data from ${props.year} onwards is available to download in a .csv format.`}
          </Typography>
          <Typography paragraph>
            <b>Note:</b> File size may be larger than 100MB.
          </Typography>
        </DialogContent>
        <DialogActions>
          <LoadingButton
            variant="contained"
            color="secondary"
            loadingPosition="start"
            startIcon={<Download />}
            loading={loading}
            onClick={handleDownload}
          >
            Click here to download
          </LoadingButton>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}

export default DownloadDataButton;
