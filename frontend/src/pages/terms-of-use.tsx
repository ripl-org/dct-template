import Link from '@/components/Link';
import { Box, Container, Typography } from '@mui/material';
import Head from 'next/head';

function TermsOfUsePage() {
  return (
    <>
      <Head>
        <title>Terms of Use | Data for Community Trust</title>
      </Head>
      <Container sx={{ py: 8 }}>
        <Typography component="h1" variant="h3" fontWeight="bold" gutterBottom color="primary.dark">
          Terms of Use
        </Typography>
        <Typography paragraph variant="caption">
          Last Updated: March 29, 2024
        </Typography>
        <Typography paragraph>
          Data for Community Trust (DCT) is a project of the Village of Hazel Crest that is supported by Innovate Policy
          Lab d/b/a “Research Improving People’s Lives” (“RIPL”), a Rhode Island non-profit corporation.
        </Typography>
        <Typography paragraph>
          Data for Community Trust (DCT) provides access to information about public safety in Hazel Crest, IL.
        </Typography>
        <Typography paragraph>
          DCT is not a substitute for official law enforcement records or information. Data on this website may differ
          from other official data, and it may change or be updated at any time.
        </Typography>
        <Typography paragraph>
          DCT&apos;s goal is to inform transparent, actionable conversations between community members and the public
          safety agencies that serve them. You agree not to use the website for any illegal or immoral purposes,
          including without limitation interfering with ongoing police work or involved parties.
        </Typography>
        <Typography paragraph>
          By visiting and using this website, including its subpages, and all content, data, and services available on
          this website (collectively, the “Website”), you are agreeing to the below Terms of Use (the “Terms”). If you
          do not agree to these Terms, you should not access the Website.
        </Typography>
        <Typography paragraph>
          Any reference herein to the partners, clients, and/or licensors of RIPL’s shall be deemed to include the Hazel
          Crest Police Department.
        </Typography>
        <Typography paragraph>
          Our collection and processing of personal information is also subject to the Data for Community Trust{' '}
          <Link href="privacy-policy">Privacy Policy</Link>, which is incorporated into these Terms by this reference.
        </Typography>
        <Typography paragraph>
          All references herein to these “Terms” shall be construed as also referring to the Privacy Policy.
        </Typography>
        <Typography component="h2" variant="h6" fontWeight="bold" gutterBottom>
          Change Without Notice
        </Typography>
        <Typography paragraph>
          This Website is dynamic and will change over time without notice. Subject to the disclaimer below, Data for
          Community Trust endeavors to provide accurate and timely data; however, users of this Website are responsible
          for checking the accuracy, completeness, currency, and suitability of content found on the Website themselves.
        </Typography>
        <Typography paragraph>
          In addition, we reserve the right to modify the Terms of Use and Privacy Policy at any time. We encourage you
          to review the Terms of Use and Privacy Policy on a regular basis. Your continued use of the Data for Community
          Trust website following any modifications to the Terms of Use or Privacy Policy constitutes your agreement to
          such modifications.
        </Typography>

        <Typography component="h2" variant="h6" fontWeight="bold" gutterBottom>
          Use of the Website
        </Typography>
        <Typography paragraph>
          We grant you a personal, limited, revocable, non-transferable, non-exclusive license to access and use the
          Website. You may use the Website only for your own noncommercial personal use and in compliance with these
          Terms.
        </Typography>
        <Typography paragraph>
          We reserve the right, in our sole discretion and without notice to you, to change, suspend, add to, or
          discontinue any aspect of the Website, and we will not be liable to you or to any third party for doing so.
        </Typography>
        <Typography paragraph>
          Without limiting the foregoing, You agree you will not use or attempt to use the Website for any of the
          following purposes:
        </Typography>
        <Box component="ul">
          <Typography component="li">
            Engaging in conduct which may constitute a criminal offense, give rise to civil liability, or otherwise
            violate any law or regulation;
          </Typography>
          <Typography component="li">
            Interfering in any way with any police investigation or other police activities;
          </Typography>
          <Typography component="li">Spreading misinformation or propaganda of any kind;</Typography>
          <Typography component="li">Interfering in any way with the Website’s network security</Typography>
          <Typography component="li">
            Using the Website to gain unauthorized access to any other computer system;
          </Typography>
          <Typography component="li">
            Using spiders, robots, or other automated data mining techniques to catalogue, download, store, or otherwise
            reproduce or distribute data or content available on the Website;
          </Typography>
          <Typography component="li">Collecting any personal information of any other users;</Typography>
          <Typography component="li">
            Forging or masking your true identity by using proxy servers or otherwise;
          </Typography>
          <Typography component="li">Engaging in any fraudulent activity;</Typography>
          <Typography component="li">
            Engaging in any activity that may violate the violate the rights of any other party; or
          </Typography>
          <Typography component="li">Engaging in any other activity that may violate these Terms.</Typography>
        </Box>

        <Typography component="h2" variant="h6" fontWeight="bold" gutterBottom>
          Ownership
        </Typography>
        <Typography paragraph>
          You acknowledge and agree the data, content, materials, text, images, videos, graphics, trademarks, logos,
          icons, software, and other elements available on the Website are the property of RIPL, our licensors, and/or
          our clients, and are protected by copyright, trademark, and/or other proprietary rights and laws. You agree
          not to sell, license, rent, distribute, copy, reproduce, transmit, publicly display, publicly perform,
          publish, modify, or create derivative works from any content or materials on the Website.
        </Typography>
        <Typography paragraph>
          Duplication or use of any content from this Website for commercial purposes or in any manner likely to give
          the impression of official approval by RIPL is prohibited.
        </Typography>

        <Typography component="h2" variant="h6" fontWeight="bold" gutterBottom id="disclaimer">
          Disclaimer
        </Typography>
        <Typography paragraph>
          Data for Community Trust provides access to information about police activities and public safety in Hazel
          Crest, IL. This website is in beta, which means it is still under development. It is made available to the
          public for testing and feedback at this time.
        </Typography>
        <Typography paragraph>
          Data for Community Trust is not a substitute for official law enforcement records or information. Data on this
          website may differ from other official data, and may change or be updated at any time. Additional disclaimer
          information is available in the{' '}
          <Link variant="inherit" href="#disclaimer">
            Terms of Use
          </Link>
          .
        </Typography>
        <Typography paragraph>
          The website is provided to promote transparency and dialogue between communities and public safety
          departments. You agree not to use the website for any illegal or immoral purposes, including without
          limitation interfering with ongoing police work or involved parties.
        </Typography>
        <Typography paragraph>
          As a result of differing update and verification procedures, data displayed on this website may differ from
          any dashboards and data reports made available by the Illinois State Police or by the Federal Bureau of
          Investigation.
        </Typography>
        <Typography paragraph>
          The Hazel Crest Police Department dispatch center does not release information on calls for service that you
          may see on the map. Please do not tie up phone lines by calling the dispatch center or 911 to seek additional
          information related to what appears on this website.
        </Typography>
        <Typography paragraph>
          Dashboards within the website are updated as new data becomes available. Only data for incidents indicated as
          closed are available. No real-time data is used in this site, and this site should not be used to reflect
          real-time police or crime activity.
        </Typography>
        <Typography paragraph>
          The nature of these public data sources and their collection in the field can impact accuracy and completeness
          and thus we cannot guarantee the accuracy of visualizations. Data visualizations instead strive for
          transparency in key definitions, known data gaps, and intended publishing process to support community
          engagement with this data.
        </Typography>
        <Typography paragraph>
          YOU ASSUME ALL RESPONSIBILITY AND RISK WITH RESPECT TO YOUR USE OF THE WEBSITE. THE WEBSITE AND ALL DATA,
          CONTENT, AND OTHER INFORMATION ON OR ACCESSIBLE FROM OR THROUGH THE WEBSITE ARE PROVIDED ON AN “AS IS” AND “AS
          AVAILABLE” BASIS WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
          IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NONINFRINGEMENT, SECURITY, OR
          ACCURACY. SPECIFICALLY, BUT WITHOUT LIMITATION, RIPL DOES NOT WARRANT THAT: (1) ANY DATA OR INFORMATION
          AVAILABLE THROUGH THE WEBSITE IS CORRECT, ACCURATE, OR RELIABLE; (2) THE WEBSITE WILL BE UNINTERRUPTED OR
          ERROR-FREE; (3) DEFECTS WILL BE CORRECTED; OR (4) THE WEBSITE OR THE SERVERS THAT MAKE IT AVAILABLE ARE FREE
          OF VIRUSES OR OTHER HARMFUL COMPONENTS.
        </Typography>

        <Typography component="h2" variant="h6" fontWeight="bold" gutterBottom>
          Indemnification
        </Typography>
        <Typography paragraph>
          You agree to indemnify, hold harmless, and defend RIPL and its partners, clients, and licensors, together with
          their respective owners, officers, directors, employees, and other agents, from and against any and all
          claims, liabilities, damages, costs, and expenses of defense, including but not limited to attorneys’ fees, in
          any way arising from or related to your use of the Website, your violation of these Terms, or your violation
          of any law or the rights of a third party.
        </Typography>

        <Typography component="h2" variant="h6" fontWeight="bold" gutterBottom>
          Limitation of Liability
        </Typography>
        <Typography paragraph>
          UNDER NO CIRCUMSTANCES, INCLUDING, BUT NOT LIMITED TO, NEGLIGENCE, SHALL RIPL OR ANY OF ITS AGENTS, PARTNERS,
          CLIENTS, AND/OR LICENSORS (INCLUDING THEIR RESPECTIVE OWNERS, OFFICERS, DIRECTORS, EMPLOYEES, AND OTHER
          AGENTS) BE LIABLE TO ANY USER OF THE SERVICES OR ANY OTHER PERSON OR ENTITY FOR ANY DIRECT, INDIRECT, SPECIAL,
          INCIDENTAL, PUNITIVE, CONSEQUENTIAL, OR EXEMPLARY DAMAGES (INCLUDING, BUT NOT LIMITED TO, DAMAGES FOR LOSS OF
          PROFITS, LOSS OF DATA, OR LOSS OF USE) ARISING OUT OF THE USE OR INABILITY TO USE THE WEBSITE, WHETHER BASED
          UPON WARRANTY, CONTRACT, TORT, OR OTHERWISE, EVEN IF RIPL OR ANY OF THE RELATED PARTIES NAMED ABOVE HAS BEEN
          ADVISED OF OR SHOULD HAVE KNOWN OF THE POSSIBILITY OF SUCH DAMAGES OR LOSSES. IN NO EVENT SHALL THE TOTAL
          LIABILITY OF RIPL OR ANY OF THE RELATED PARTIES NAMED ABOVE FOR ALL DAMAGES, LOSSES, AND/OR CAUSES OF ACTION
          RESULTING FROM YOUR USE OF THE WEBSITE, WHETHER IN CONTRACT, TORT (INCLUDING, BUT NOT LIMITED TO, ACTIONS
          BASED ON NEGLIGENCE) OR OTHERWISE, EXCEED THE GREATER OF (A) ANY FEES PAID BY YOU FOR USE OF THE WEBSITE OR
          (B) SEVENTY-FIVE DOLLARS ($75).
        </Typography>

        <Typography component="h2" variant="h6" fontWeight="bold" gutterBottom>
          Class Action Waiver
        </Typography>
        <Typography paragraph>
          BY USING THE WEBSITE YOU WAIVE ANY RIGHT TO ASSERT ANY CLAIMS AGAINST RIPL OR ANY OF ITS AGENTS, PARTNERS,
          CLIENTS, AND/OR LICENSORS (INCLUDING THEIR RESPECTIVE OWNERS, OFFICERS, DIRECTORS, EMPLOYEES, AND OTHER
          AGENTS) AS A REPRESENTATIVE OR MEMBER IN ANY CLASS OR REPRESENTATIVE ACTION, EXCEPT WHERE SUCH WAIVER IS
          PROHIBITED BY LAW OR DEEMED BY A COURT OF LAW TO BE AGAINST PUBLIC POLICY.
        </Typography>

        <Typography component="h2" variant="h6" fontWeight="bold" gutterBottom>
          Links to External Websites and Pages
        </Typography>
        <Typography paragraph>
          This Website may contain hypertext links to external sites and pages containing information created and
          maintained by public and private organizations other than RIPL. These hypertext links may be created by RIPL
          if it determines that establishing the external link will be consistent with assisting or furthering the
          purpose of this Website.
        </Typography>
        <Typography paragraph>
          In addition, hypertext links may be created by RIPL for informational purposes, that is, where the linked
          external website will provide useful and valuable information to visitors to this Website, or where the linked
          external website is required or authorized by law.
        </Typography>
        <Typography paragraph>
          RIPL, in its sole discretion, will determine whether the external website meets the purpose of this Website or
          for the specified informational purposes. The inclusion of a hypertext link to an external website is not
          intended as an endorsement of any products or service offered or referenced on the linked website, the
          organizations sponsoring such website, or any views which might be expressed or referenced on the website.
        </Typography>
        <Typography paragraph>
          These hypertext links to external sites and pages may be removed or replaced in the sole discretion of RIPL,
          at any time without notice.
        </Typography>
        <Typography paragraph>
          In the event you discover problems with or have concerns regarding the format, accuracy, timeliness, or
          completeness of a linked external site, please contact the organization responsible for the linked external
          site – RIPL does not control nor is it responsible for any linked external sites and pages.
        </Typography>
        <Typography paragraph>
          You are also strongly encouraged to review the terms of use and privacy policies associated with such external
          sites and pages before using them.
        </Typography>
        <Typography paragraph>
          If you have a question or notice an issue with a link please e-mail:
          <Link
            href="mailto:info@hazelcrest.dataforcommunitytrust.org"
            target="_blank"
            sx={{ wordBreak: { xs: 'break-word', md: 'normal' } }}
          >
            info@hazelcrest.dataforcommunitytrust.org
          </Link>
          .
        </Typography>

        <Typography component="h2" variant="h6" fontWeight="bold" gutterBottom>
          Disputes
        </Typography>
        <Typography paragraph>
          Any dispute in connection with these Terms shall be governed by the laws of the State of Illinois, and shall
          be settled in the state and federal courts located in Chicago, Illinois.
        </Typography>
        <Typography paragraph>
          These terms shall be governed by and construed in accordance with the laws of the State of Illinois without
          giving effect to any conflict of laws principles thereof. Any dispute arising out of or relating to these
          Terms or access or use of this Website shall be decided under the laws of and in the state courts in the State
          of Illinois and you hereby consent to and submit to the personal jurisdiction of such courts for the purpose
          of adjudicating such dispute.
        </Typography>

        <Typography component="h2" variant="h6" fontWeight="bold" gutterBottom>
          Severability
        </Typography>
        <Typography paragraph>
          If any provision of these Terms shall be determined to be unlawful, void, or unenforceable by a court of
          competent jurisdiction, then that provision shall be deemed severable from the remaining terms and shall not
          affect the validity and enforceability of the remaining provisions.
        </Typography>
      </Container>
    </>
  );
}

export default TermsOfUsePage;
