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

interface TrialExpiredEmailProps {
  firstName: string;
  isEtsyUser?: boolean;
  baseUrl?: string;
}

export const TrialExpiredEmail = ({
  firstName = 'there',
  isEtsyUser = false,
  baseUrl = 'https://hunnimoon.app',
}: TrialExpiredEmailProps) => (
  <Html>
    <Head />
    <Preview>
      {isEtsyUser
        ? 'Keep using Hunnimoon with your 3 months free!'
        : 'Your Hunnimoon trial has ended'}
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
            <Heading style={heading}>Keep using Hunnimoon for free! 💝</Heading>

            <Text style={text}>Hi {firstName},</Text>

            <Text style={text}>
              Your 7-day trial has ended, but you can keep going! Since you
              purchased from Veil & Vibe on Etsy, you have 3 months of free
              access included.
            </Text>

            <Text style={text}>
              All your wedding details are still safe, and you can log in anytime
              to view them. To continue adding guests, managing your budget, and
              organizing vendors, just activate your 3 months free.
            </Text>

            <Section style={instructionsBox}>
              <Text style={instructionsTitle}>
                <strong>How to activate:</strong>
              </Text>
              <ol style={instructionsList}>
                <li style={instructionsItem}>
                  Find your promo code in the PDF from your Etsy purchase
                </li>
                <li style={instructionsItem}>
                  Click the button below to go to settings
                </li>
                <li style={instructionsItem}>
                  Enter your code at checkout
                </li>
                <li style={instructionsItem}>
                  Enjoy 3 months free (no charge!)
                </li>
              </ol>
            </Section>

            <Section style={buttonContainer}>
              <Button style={button} href={`${baseUrl}/pricing?intent=upgrade&promo=true`}>
                Activate 3 Months Free
              </Button>
            </Section>

            <Text style={helpText}>
              Can't find your code? Check your Etsy account under "Purchases and
              Reviews" → "Download Files". Need help? Email{' '}
              <Link href="mailto:hunnimoon@veilandvibe.com" style={link}>
                hunnimoon@veilandvibe.com
              </Link>
            </Text>
          </>
        ) : (
          <>
            <Heading style={heading}>Your trial has ended</Heading>

            <Text style={text}>Hi {firstName},</Text>

            <Text style={text}>
              Your 7-day trial of Hunnimoon has ended. Don't worry - all your
              wedding details are still safe!
            </Text>

            <Text style={text}>
              You can still log in anytime to view your guest list, budget, and
              vendor information. To continue adding guests, tracking expenses,
              and managing RSVPs, upgrade to Hunnimoon Pro.
            </Text>

            <Section style={pricingBox}>
              <div style={pricingOption}>
                <Text style={pricingTitle}>Monthly Plan</Text>
                <Text style={pricingPrice}>$14.99/month</Text>
                <Text style={pricingDesc}>Cancel anytime</Text>
              </div>
              <div style={pricingOption}>
                <Text style={pricingTitle}>Yearly Plan</Text>
                <Text style={pricingPrice}>$119.99/year</Text>
                <Text style={pricingDesc}>Save 33%</Text>
              </div>
            </Section>

            <Section style={buttonContainer}>
              <Button style={button} href={`${baseUrl}/pricing?intent=upgrade`}>
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

export default TrialExpiredEmail;

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

const helpText = {
  fontSize: '15px',
  lineHeight: '22px',
  color: '#6b7280',
  margin: '16px 0 0',
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
