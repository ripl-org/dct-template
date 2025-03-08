import Link from '@/components/Link';
import { Container, Typography, Stack, Box } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import Head from 'next/head';

function PrivacyPolicyPage() {
  return (
    <>
      <Head>
        <title>Privacy Policy | Data for Community Trust</title>
      </Head>
      <Container sx={{ py: 8 }}>
        <Typography component="h1" variant="h3" fontWeight="bold" gutterBottom color="primary.dark">
          Privacy Policy
        </Typography>
        <Typography paragraph variant="caption">
          Last Updated: February 22, 2024
        </Typography>
        <Typography paragraph>
          Data for Community Trust is a project of Innovate Policy Lab d/b/a “Research Improving People’s Lives”
          (“RIPL”), a Rhode Island non-profit corporation.
        </Typography>
        <Typography paragraph>
          The Data for Community Trust project is intended to provide access to information about police activities and
          public safety in Hazel Crest.
        </Typography>
        <Typography paragraph>
          This project aims to give residents and others access to data to be informed about incidents taking place in
          the community and learn about policing activities and interactions in the community.
        </Typography>
        <Typography paragraph>
          By visiting and using this website, including its subpages, and all content, data, and services available on
          this website (collectively, the “Website”), you are agreeing to this privacy policy (this “Policy”). If you do
          not agree to this Policy, you should not access the Website.
        </Typography>
        <Typography paragraph>
          We’ve developed this Policy to describe (1) how we collect, use, transfer, and store information of
          individuals in connection with the Website; (2) your choices regarding your personal information; and (3) how
          we ensure your privacy.
        </Typography>
        <Typography paragraph>
          This Policy is also incorporated into and forms a part of the Data for Community Trust{' '}
          <Link variant="inherit" href="terms-of-use">
            Terms of Use
          </Link>
          .
        </Typography>

        <Typography component="h2" variant="h6" fontWeight="bold" gutterBottom>
          Modifications
        </Typography>
        <Typography paragraph>
          This Policy may also be updated from time to time. Your continued use of the Website following any such
          changes constitutes your agreement to such changes.
        </Typography>
        <Typography component="h2" variant="h6" fontWeight="bold" gutterBottom>
          Accessibility
        </Typography>
        <Typography paragraph>
          We endeavor to make the Website, including this Policy, accessible to individuals with disabilities. Please
          note, however, that we may not have control over some data visualizations (e.g., charts and graphic
          representations of data) provided by our third-party partners. If you are having trouble accessing the Website
          or this Policy, please contact us as provided below.
        </Typography>
        <Typography component="h2" variant="h6" fontWeight="bold" gutterBottom>
          Your Personal Information
        </Typography>
        <Typography paragraph>
          As used this Policy, the term “personal information” means information that identifies, relates to, describes,
          is capable of being associated with, or could reasonably be linked with a particular data subject, consumer,
          or household.
        </Typography>
        <Typography paragraph>
          Personal information includes information such as real names, postal addresses, email addresses, and social
          security numbers, but it may also include unique identifiers, geolocation data, or internet or other network
          activity (such as browsing history, search history, etc.).
        </Typography>

        <Typography paragraph>
          In connection with making the Website available, we will collect and process personal information of
          individuals who reside in Hazel Crest or are otherwise involved in any Hazel Crest Police Department
          investigation or other activities.
        </Typography>

        <Typography paragraph>
          However, information is only made publicly available through the Website on an aggregate, non-identifiable
          basis.
        </Typography>

        <Typography component="p" variant="body1" sx={{ fontWeight: 700 }} gutterBottom>
          Information Collected from the Hazel Crest Police Department
        </Typography>

        <Typography paragraph>
          This site consumes data from the Hazel Crest Police Department on individuals involved in Crime, Calls for
          Service, Traffic Stops, and Police Officer uses of force. Within these categories we obtain personal
          identifiable information as outlined below. All of these data are deidentified and in some cases aggregated
          before made available on the site. We also collect deidentified demographic level information including race
          and sex.
        </Typography>

        <Typography paragraph>
          The underlying de-identified data tables driving visualizations displayed on the website can be exported by
          users of the website and Tableau Public. Data consumed from the police department is accessible by RIPL, the
          Hazel Crest Police Department, and our third-party service providers, including web hosting and information
          security providers.
        </Typography>

        <Typography component="p" variant="body1" sx={{ fontWeight: 700 }} gutterBottom>
          Individual-Level Information
        </Typography>

        <Typography paragraph>
          The following types of information may be made available for individual incidents on the website. Please note
          that not all of these variables may be made available.
        </Typography>

        <Grid
          container
          spacing={2}
          mb={3}
          sx={{
            borderTop: '1px solid',
            borderLeft: '1px solid',
            borderColor: 'divider',
            '& > div': {
              borderRight: '1px solid',
              borderBottom: '1px solid',
              borderColor: 'divider',
            },
          }}
        >
          <Grid {...{ xs: 12, sm: 6, md: 3 }} minHeight={160}>
            <Stack>
              <Typography sx={{ fontWeight: 'bold' }}>Calls</Typography>
              <Typography variant="caption">Record Number</Typography>
              <Typography variant="caption">Incident Number</Typography>
              <Typography variant="caption">Date/Time</Typography>
              <Typography variant="caption">Call Method</Typography>
              <Typography variant="caption">Call Nature</Typography>
              <Typography variant="caption">Call Priority</Typography>
              <Typography variant="caption">Call Type</Typography>
              <Typography variant="caption">Latitude (low precision)</Typography>
              <Typography variant="caption">Longitude (low precision)</Typography>
              <Typography variant="caption">Street/Cross Street</Typography>
              <Typography variant="caption">Date/Time Reported</Typography>
              <Typography variant="caption" pb={1}>
                Date/Time Updated
              </Typography>

              <Typography sx={{ fontWeight: 'bold' }}>Radio Log</Typography>
              <Typography variant="caption">Record Number</Typography>
              <Typography variant="caption">Agency</Typography>
              <Typography variant="caption">Zone</Typography>
              <Typography variant="caption">Date/Time</Typography>
              <Typography variant="caption">Call Nature</Typography>
              <Typography variant="caption">Call Priority</Typography>
              <Typography variant="caption">Call Type</Typography>
              <Typography variant="caption">Date/Time Arrived</Typography>
              <Typography variant="caption">Date/Time Completed</Typography>
              <Typography variant="caption">Officer Information</Typography>
              <Typography variant="caption">(redacted)</Typography>
              <Typography variant="caption">Response Time</Typography>
              <Typography variant="caption">Time on Scene</Typography>
              <Typography variant="caption">Date/Time Reported</Typography>
              <Typography variant="caption">Date/Time Updated</Typography>
            </Stack>
          </Grid>
          <Grid {...{ xs: 12, sm: 6, md: 3 }} minHeight={160}>
            <Stack>
              <Typography sx={{ fontWeight: 'bold' }}>Offenses</Typography>
              <Typography variant="caption">Record Number</Typography>
              <Typography variant="caption">Incident Number</Typography>
              <Typography variant="caption">Crime Category</Typography>
              <Typography variant="caption">Offense Code</Typography>
              <Typography variant="caption">Offense Description</Typography>
              <Typography variant="caption">NIBRS Code</Typography>
              <Typography variant="caption">NIBRS Description</Typography>
              <Typography variant="caption">Statute Code</Typography>
              <Typography variant="caption">Statute Description</Typography>
              <Typography variant="caption">Disposition</Typography>
              <Typography variant="caption">Latitude (low precision)</Typography>
              <Typography variant="caption">Longitude (low precision)</Typography>
              <Typography variant="caption">Street/Cross Street</Typography>
              <Typography variant="caption">Date/Time Reported</Typography>
              <Typography variant="caption" pb={1}>
                Date/Time Updated
              </Typography>

              <Typography sx={{ fontWeight: 'bold' }}>Arrestees</Typography>
              <Typography variant="caption">Arrest Number</Typography>
              <Typography variant="caption">Incident Number</Typography>
              <Typography variant="caption">Disposition</Typography>
              <Typography variant="caption">Statue Description</Typography>
              <Typography variant="caption">Age Group</Typography>
              <Typography variant="caption">Race</Typography>
              <Typography variant="caption">Sex</Typography>
              <Typography variant="caption">Date/Time Reported</Typography>
              <Typography variant="caption">Date/Time Updated</Typography>
            </Stack>
          </Grid>
          <Grid {...{ xs: 12, sm: 6, md: 3 }} minHeight={160}>
            <Stack>
              <Typography sx={{ fontWeight: 'bold' }}>Incidents</Typography>
              <Typography variant="caption">Record Number</Typography>
              <Typography variant="caption">Incident Number</Typography>
              <Typography variant="caption">Crime Category</Typography>
              <Typography variant="caption">Call Nature</Typography>
              <Typography variant="caption">Incident Type</Typography>
              <Typography variant="caption">How Received</Typography>
              <Typography variant="caption">Disposition</Typography>
              <Typography variant="caption">Latitude (low precision)</Typography>
              <Typography variant="caption">Longitude (low precision)</Typography>
              <Typography variant="caption">Street/Cross Street</Typography>
              <Typography variant="caption">Date/Time Reported</Typography>
              <Typography variant="caption" pb={1}>
                Date/Time Updated
              </Typography>

              <Typography sx={{ fontWeight: 'bold' }}>Traffic Stops</Typography>
              <Typography variant="caption">Record Number</Typography>
              <Typography variant="caption">Traffic Stop Number</Typography>
              <Typography variant="caption">Date/Time</Typography>
              <Typography variant="caption">Latitude (low precision)</Typography>
              <Typography variant="caption">Longitude (low precision)</Typography>
              <Typography variant="caption">Street/Cross Street</Typography>
              <Typography variant="caption">City</Typography>
              <Typography variant="caption">Date/Time Reported</Typography>
              <Typography variant="caption">Date/Time Updated</Typography>
            </Stack>
          </Grid>
          <Grid {...{ xs: 12, sm: 6, md: 3 }} minHeight={160}>
            <Stack>
              <Typography sx={{ fontWeight: 'bold' }}>Use of Force</Typography>
              <Typography variant="caption">Incident Number</Typography>
              <Typography variant="caption">Date</Typography>
              <Typography variant="caption">Type of Force</Typography>
              <Typography variant="caption">Initiated by Officer</Typography>
              <Typography variant="caption">Call Category</Typography>
              <Typography variant="caption">Disposition</Typography>
              <Typography variant="caption">Officer Information (redacted)</Typography>
              <Typography variant="caption">Subject Weapons</Typography>
              <Typography variant="caption">Subject Race</Typography>
              <Typography variant="caption">Subject Ethnicity</Typography>
              <Typography variant="caption">Subject Sex</Typography>
              <Typography variant="caption">Subject Age Group</Typography>
              <Typography variant="caption">Latitude (low precision)</Typography>
              <Typography variant="caption">Longitude (low precision)</Typography>
              <Typography variant="caption">Zone</Typography>
              <Typography variant="caption">Notes</Typography>
              <Typography variant="caption">Date/Time Updated</Typography>
            </Stack>
          </Grid>
        </Grid>

        <Typography component="p" variant="body1" sx={{ fontWeight: 700 }} gutterBottom>
          Aggregated Information
        </Typography>

        <Typography paragraph>
          The following types of information are available at an aggregated level for the website and supporting data
          visualizations, meaning that a summary of one or more calls is available without the details of each
          individual call:
        </Typography>

        <Grid
          container
          spacing={2}
          mb={3}
          sx={{
            borderTop: '1px solid',
            borderLeft: '1px solid',
            borderColor: 'divider',
            '& > div': {
              borderRight: '1px solid',
              borderBottom: '1px solid',
              borderColor: 'divider',
            },
          }}
        >
          <Grid {...{ xs: 12, sm: 6, md: 4 }} minHeight={160}>
            <Stack>
              <Typography sx={{ fontWeight: 'bold' }}>Offenders</Typography>
              <Typography variant="caption">Year/Month</Typography>
              <Typography variant="caption">Crime Category</Typography>
              <Typography variant="caption">Age Group</Typography>
              <Typography variant="caption">Sex</Typography>
              <Typography variant="caption">Race</Typography>
              <Typography variant="caption">Count</Typography>
              <Typography variant="caption">Percent</Typography>
              <Typography variant="caption">Date/Time Updated</Typography>
            </Stack>
          </Grid>
          <Grid {...{ xs: 12, sm: 6, md: 4 }} minHeight={160}>
            <Stack>
              <Typography sx={{ fontWeight: 'bold' }}>Victims</Typography>
              <Typography variant="caption">Year/Month</Typography>
              <Typography variant="caption">Crime Category</Typography>
              <Typography variant="caption">Age Group</Typography>
              <Typography variant="caption">Sex</Typography>
              <Typography variant="caption">Race</Typography>
              <Typography variant="caption">Count</Typography>
              <Typography variant="caption">Percent</Typography>
              <Typography variant="caption">Date/Time Updated</Typography>
            </Stack>
          </Grid>
          <Grid {...{ xs: 12, sm: 6, md: 4 }} minHeight={160}>
            <Stack>
              <Typography sx={{ fontWeight: 'bold' }}>Crime Rate</Typography>
              <Typography variant="caption">Year/Month</Typography>
              <Typography variant="caption">Crime Category</Typography>
              <Typography variant="caption">Count</Typography>
              <Typography variant="caption">Population</Typography>
              <Typography variant="caption">Trailing 12 Month Sum</Typography>
              <Typography variant="caption">Trailing 12 Month Rate</Typography>
              <Typography variant="caption">Date/Time Updated</Typography>
            </Stack>
          </Grid>
        </Grid>

        <Typography component="p" variant="body1" sx={{ fontWeight: 700 }} gutterBottom>
          Browsing Information
        </Typography>

        <Typography paragraph>
          If you browse through this Website to read, print, or download information, we may also automatically collect
          certain navigational information, including without limitation domain from which you access the internet,
          Internet Protocol (IP) address, operating system on your computer and information about the browser you used
          when visiting the site, date and time of your visit, pages you visited, address of the website that connected
          you to the website, clicks, and other interaction data for the purpose of analytics and website monitoring.
        </Typography>

        <Typography component="h2" variant="h6" fontWeight="bold" gutterBottom>
          Data for Community Trust (DCT) Website Privacy Principles
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 700 }} gutterBottom>
          No Active Calls and Time Delay
        </Typography>
        <Typography paragraph>
          The website protects the privacy of parties involved in active calls by only displaying information for calls
          that have an incident report and that occurred before midnight of the previous day.
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 700 }} gutterBottom>
          Public Records Availability
        </Typography>
        <Typography paragraph>
          The website automates and improves access to information that would otherwise be available through a public
          records request. Information that is unavailable through a public records request under federal or state law
          is also unavailable on the website.
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 700 }} gutterBottom>
          Suppressed Information
        </Typography>
        <Typography paragraph>
          Unlike a public records request, this website can be accessed anonymously. To protect the privacy of parties
          involved in sensitive matters, the following information is suppressed:
        </Typography>

        <Box component="ul">
          <Typography component="li">Locations of domestic, medical, and mental health calls are omitted</Typography>
          <Typography component="li">Officer information is redacted</Typography>
          <Typography component="li">
            Individual-level information is redacted for incidents involving juveniles under the age of 18
          </Typography>
        </Box>

        <Typography variant="body1" sx={{ fontWeight: 700 }}>
          Geolocation Information
        </Typography>
        <Typography paragraph>
          To protect the residential privacy of parties involved, Website provides latitude and longitude at a lower
          precision (&gt;100 meters) than is available in official records.
        </Typography>

        <Typography component="h2" variant="h6" fontWeight="bold" gutterBottom>
          How We Share Your Information
        </Typography>
        <Typography paragraph>
          Navigational, usage, or analytics data is shared with Hazel Crest Police Department, and RIPL’s contracting
          partners.
        </Typography>
        <Typography paragraph>
          We may also use and share your information as reasonably necessary to comply with law or a legal process
          (including a court or government order or subpoena); to detect, prevent, or otherwise address fraud, security
          or technical issues; to enforce the Terms of Use and this Policy; to protect the rights, property or safety of
          the State of Illinois, the City of Hazel Crest, our users, and/or the public; or otherwise with your express
          consent.
        </Typography>

        <Typography component="h2" variant="h6" fontWeight="bold" gutterBottom>
          How We Store and Secure Your Information
        </Typography>
        <Typography paragraph>
          RIPL uses reasonable security measures in an effort to prevent loss, misuse, and alteration of information
          under our control. However, we cannot guarantee the security of information on or transmitted via the
          Internet. Please note, additionally, that we have no control over the security of other sites you might visit.
        </Typography>

        <Typography component="h2" variant="h6" fontWeight="bold" gutterBottom>
          Cookie Policy
        </Typography>
        <Typography paragraph>
          A cookie is a small piece of data that a website asks your browser to store on your computer or mobile device.
          The cookie allows the website to “remember” your actions or preferences over time. Most browsers support
          cookies, but users can set their browsers to decline them and can delete them whenever they like. We use the
          following types of cookies on our site.
        </Typography>

        <Typography component="p" variant="body1" sx={{ fontWeight: 700 }} gutterBottom>
          Security
        </Typography>
        <Typography paragraph>
          We use cookies to enable and support our security features, and to help us detect malicious activity.
        </Typography>

        <Typography component="p" variant="body1" sx={{ fontWeight: 700 }} gutterBottom>
          Preferences, Features and Services
        </Typography>
        <Typography paragraph>
          Cookies can tell us which settings you prefer. They can help you fill out forms on our sites more easily. They
          also provide you with features, insights, and customized content.
        </Typography>

        <Typography component="p" variant="body1" sx={{ fontWeight: 700 }} gutterBottom>
          Performance, Analytics and Research
        </Typography>
        <Typography paragraph>
          Cookies help us track how well we are performing. We also use cookies to understand, improve, and research
          features and services, including to create logs and record when you access websites from different devices,
          such as your computer or your mobile device.
        </Typography>
        <Typography paragraph>
          Persistent cookies can be removed by following your web browser’s directions. A session cookie is temporary
          and disappears after you close your browser.
        </Typography>
        <Typography paragraph>
          You can reset your web browser to refuse all cookies or to indicate when a cookie is being sent. However, some
          features of our sites may not function properly if the ability to accept cookies is disabled.
        </Typography>

        <Typography component="h2" variant="h6" fontWeight="bold" gutterBottom>
          Do Not Track
        </Typography>
        <Typography paragraph>
          Some browsers have a “do not track” feature that lets you tell websites you do not want to have your online
          activities tracked across various websites. We do not track your activities across other websites.
        </Typography>

        <Typography component="h2" variant="h6" fontWeight="bold" gutterBottom>
          Contact Us
        </Typography>

        <Typography paragraph>
          If you have any questions or concerns about this Policy or any matters related to your personal information,
          you can contact us at:{' '}
          <Link href="mailto:info@hazelcrest.dataforcommunitytrust.org" target="_blank" sx={{ wordWrap: 'break-word' }}>
            info@hazelcrest.dataforcommunitytrust.org
          </Link>
        </Typography>
      </Container>
    </>
  );
}

export default PrivacyPolicyPage;
