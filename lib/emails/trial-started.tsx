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

interface TrialStartedEmailProps {
  firstName: string;
  isEtsyUser?: boolean;
  baseUrl?: string;
}

export const TrialStartedEmail = ({
  firstName = 'there',
  isEtsyUser = false,
  baseUrl = 'https://hunnimoon.app',
}: TrialStartedEmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to Hunnimoon! Your 7-day trial starts now</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={`${baseUrl}/hunnimoon%20full%20logo%201.png`}
          width="174"
          height="auto"
          alt="Hunnimoon"
          style={logo}
        />

        <Heading style={heading}>Welcome to Hunnimoon! 🎉</Heading>

        <Text style={text}>Hi {firstName},</Text>

        <Text style={text}>
          Your 7-day free trial has officially started! You now have full access
          to all of Hunnimoon's wedding planning features.
        </Text>

        <Text style={text}>Here's what you can do:</Text>

        <ul style={list}>
          <li style={listItem}>Manage your guest list</li>
          <li style={listItem}>Track your wedding budget</li>
          <li style={listItem}>Organize vendors and contacts</li>
          <li style={listItem}>Collect and manage RSVPs</li>
        </ul>

        <Section style={buttonContainer}>
          <Button style={button} href={`${baseUrl}/dashboard`}>
            Get Started
          </Button>
        </Section>

        {isEtsyUser && (
          <Section style={etsyNote}>
            <Text style={etsyText}>
              💝 <strong>Psst!</strong> Since you purchased from Veil & Vibe on Etsy,
              you have 3 months free included in your download. When your trial
              ends, just grab your code from the PDF and enter it at checkout. You
              won't be charged for 3 months!
            </Text>
          </Section>
        )}

        <Text style={text}>
          Questions? Just reply to this email or reach out at{' '}
          <Link href="mailto:hunnimoon@veilandvibe.com" style={link}>
            hunnimoon@veilandvibe.com
          </Link>
        </Text>

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

export default TrialStartedEmail;

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

const list = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#374151',
  margin: '0 0 16px',
  paddingLeft: '20px',
};

const listItem = {
  marginBottom: '8px',
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

const etsyNote = {
  backgroundColor: '#FEF3F2',
  borderLeft: '4px solid #E91E63',
  borderRadius: '4px',
  padding: '16px',
  margin: '24px 0',
};

const etsyText = {
  fontSize: '15px',
  lineHeight: '22px',
  color: '#374151',
  margin: '0',
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
