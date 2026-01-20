import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface TrialExpiringEmailProps {
  firstName: string;
  daysLeft: number;
  isEtsyUser?: boolean;
  baseUrl?: string;
}

export const TrialExpiringEmail = ({
  firstName = 'there',
  daysLeft = 3,
  isEtsyUser = false,
  baseUrl = 'https://hunnimoon.app',
}: TrialExpiringEmailProps) => (
  <Html>
    <Head />
    <Preview>
      {isEtsyUser
        ? `${daysLeft} days left - Don't forget your 3 months free!`
        : `${daysLeft} days left in your Hunnimoon trial`}
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={`${baseUrl}/hunnimoon%20full%20logo%201.png`}
          width="174"
          height="auto"
          alt="Hunnimoon"
          style={logo}
        />

        {isEtsyUser ? (
          <>
            <Heading style={heading}>
              {daysLeft} days left - Don't forget your code! 💝
            </Heading>

            <Text style={text}>Hi {firstName},</Text>

            <Text style={text}>
              Your 7-day trial ends in {daysLeft} days, but you can keep using
              Hunnimoon for 3 months free!
            </Text>

            <Text style={text}>
              Since you purchased from Veil & Vibe on Etsy, you already have a
              promo code that gives you 3 months of free access. Here's how to
              use it:
            </Text>

            <Section style={instructionsBox}>
              <Text style={instructionsTitle}>
                <strong>Finding Your Code:</strong>
              </Text>
              <ol style={instructionsList}>
                <li style={instructionsItem}>Go to your Etsy account</li>
                <li style={instructionsItem}>Click "Purchases and Reviews"</li>
                <li style={instructionsItem}>Locate your Veil & Vibe purchase</li>
                <li style={instructionsItem}>Click "Download Files"</li>
                <li style={instructionsItem}>
                  Open the PDF - your code is inside
                </li>
              </ol>
            </Section>

            <Section style={buttonContainer}>
              <Button style={button} href={`${baseUrl}/pricing`}>
                Activate Your 3 Months Free
              </Button>
            </Section>

            <Text style={text}>
              Need help? Email us at{' '}
              <Link href="mailto:hunnimoon@veilandvibe.com" style={link}>
                hunnimoon@veilandvibe.com
              </Link>
            </Text>
          </>
        ) : (
          <>
            <Heading style={heading}>{daysLeft} days left in your trial</Heading>

            <Text style={text}>Hi {firstName},</Text>

            <Text style={text}>
              Just a friendly heads up - your Hunnimoon trial ends in {daysLeft}{' '}
              days. We hope you've been enjoying planning your wedding with us!
            </Text>

            <Text style={text}>
              To keep managing your guest list, tracking your budget, and
              organizing your vendors, upgrade to Hunnimoon Pro.
            </Text>

            <Section style={pricingBox}>
              <div style={pricingOption}>
                <Text style={pricingTitle}>Monthly Plan</Text>
                <Text style={pricingPrice}>$9.99/month</Text>
                <Text style={pricingDesc}>Cancel anytime</Text>
              </div>
              <div style={pricingOption}>
                <Text style={pricingTitle}>Yearly Plan</Text>
                <Text style={pricingPrice}>$79.99/year</Text>
                <Text style={pricingDesc}>Save 33%</Text>
              </div>
            </Section>

            <Section style={buttonContainer}>
              <Button style={button} href={`${baseUrl}/pricing`}>
                Upgrade to Pro
              </Button>
            </Section>

            <Text style={text}>
              Questions? Just reply to this email or reach out at{' '}
              <Link href="mailto:hunnimoon@veilandvibe.com" style={link}>
                hunnimoon@veilandvibe.com
              </Link>
            </Text>
          </>
        )}

        <Text style={signature}>
          Happy planning!
          <br />
          The Hunnimoon Team
        </Text>

        <Section style={footer}>
          <Text style={footerText}>
            © 2026 Hunnimoon. All rights reserved.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default TrialExpiringEmail;

// Styles
const main = {
  backgroundColor: '#f9fafb',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '600px',
  borderRadius: '8px',
};

const logo = {
  margin: '0 auto 32px',
  display: 'block',
};

const heading = {
  fontSize: '28px',
  fontWeight: '700',
  color: '#1f2937',
  textAlign: 'center' as const,
  margin: '0 0 24px',
};

const text = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#374151',
  margin: '0 0 16px',
};

const instructionsBox = {
  backgroundColor: '#FEF3F2',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const instructionsTitle = {
  fontSize: '16px',
  color: '#1f2937',
  margin: '0 0 12px',
};

const instructionsList = {
  fontSize: '15px',
  lineHeight: '24px',
  color: '#374151',
  margin: '0',
  paddingLeft: '20px',
};

const instructionsItem = {
  marginBottom: '8px',
};

const pricingBox = {
  display: 'flex',
  gap: '16px',
  margin: '24px 0',
  justifyContent: 'center',
};

const pricingOption = {
  flex: '1',
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  padding: '20px',
  textAlign: 'center' as const,
};

const pricingTitle = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#6b7280',
  textTransform: 'uppercase' as const,
  margin: '0 0 8px',
};

const pricingPrice = {
  fontSize: '24px',
  fontWeight: '700',
  color: '#E91E63',
  margin: '0 0 4px',
};

const pricingDesc = {
  fontSize: '14px',
  color: '#6b7280',
  margin: '0',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#E91E63',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 32px',
};

const link = {
  color: '#E91E63',
  textDecoration: 'underline',
};

const signature = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#374151',
  margin: '32px 0 0',
};

const footer = {
  borderTop: '1px solid #e5e7eb',
  marginTop: '40px',
  paddingTop: '24px',
};

const footerText = {
  fontSize: '14px',
  color: '#6b7280',
  textAlign: 'center' as const,
  margin: '0',
};
