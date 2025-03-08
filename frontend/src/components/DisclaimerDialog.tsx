import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';

import Link from '@/components/Link';
import { sendEvent } from '@/lib/gtag';

function DisclaimerDialog() {
  const router = useRouter();
  const [open, setOpen] = React.useState(true);
  const hiddenRoutes = ['terms-of-use', 'privacy-policy'];
  const isHidden = hiddenRoutes.some((route) => router.pathname.includes(route));

  const handleClose = () => {
    setOpen(false);
    sendEvent('disclaimer_agreed_button_click');
  };

  if (isHidden) return null;

  return (
    <React.Fragment>
      <Dialog sx={{ zIndex: 1600 }} open={open}>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Disclaimer</DialogTitle>

        <DialogContent dividers>
          <Typography paragraph>
            Data for Community Trust (DCT) provides access to information about public safety in Hazel Crest, IL. This
            website is in beta, which means it is still under development. It is made available to the public for
            testing and feedback.
          </Typography>
          <Typography paragraph>
            DCT is not a substitute for official law enforcement records or information. Data on this website may differ
            from other official data, and it may change or be updated at any time. Additional disclaimer information is
            available in the{' '}
            <Link variant="inherit" href="terms-of-use">
              Terms of Use
            </Link>
            .
          </Typography>
          <Typography paragraph>
            DCT&apos;s goal is to inform transparent, actionable conversations between community members and the public
            safety agencies that serve them. You agree not to use the website for any illegal or immoral purposes,
            including without limitation interfering with ongoing police work or involved parties.
          </Typography>
          <Typography paragraph>
            By using the website, you also agree to the DCT{' '}
            <Link variant="inherit" href="terms-of-use">
              Terms of Use
            </Link>{' '}
            and{' '}
            <Link variant="inherit" href="privacy-policy">
              Privacy Policy
            </Link>
            . Contact us at{' '}
            <Link
              href="mailto:info@hazelcrest.dataforcommunitytrust.org"
              target="_blank"
              sx={{ wordWrap: 'break-word' }}
            >
              info@hazelcrest.dataforcommunitytrust.org
            </Link>
            .
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button size="small" variant="contained" color="secondary" onClick={handleClose}>
            I AGREE
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default DisclaimerDialog;
