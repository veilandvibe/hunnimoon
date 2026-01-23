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

interface SubscriptionSuccessEmailProps {
  firstName: string;
  planType: 'monthly' | 'yearly';
  isEtsyUser?: boolean;
  baseUrl?: string;
}

export const SubscriptionSuccessEmail = ({
  firstName = 'there',
  planType = 'monthly',
  isEtsyUser = false,
  baseUrl = 'https://hunnimoon.app',
}: SubscriptionSuccessEmailProps) => {
  const planName = planType === 'monthly' ? 'Monthly' : 'Yearly';
  const planPrice = planType === 'monthly' ? '$14.99/month' : '$119.99/year';
  const savings = planType === 'yearly' ? ' (33% savings!)' : '';

  return (
    <Html>
      <Head />
      <Preview>
        {isEtsyUser
          ? 'Your 3 months free has been activated! 🎉'
          : 'Welcome to Hunnimoon Pro! 🎉'}
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
              <Heading style={heading}>Your 3 months free is activated! 🎉</Heading>

              <Text style={text}>Hi {firstName},</Text>

              <Text style={text}>
                Awesome! Your Etsy promo code has been applied successfully. You
                now have <strong>3 months of free access</strong> to Hunnimoon Pro!
              </Text>

              <Section style={planBox}>
                <Text style={planTitle}>Your Plan</Text>
                <Text style={planTypeStyle}>
                  {planName} Plan - 3 Months Free
                </Text>
                <Text style={planDetails}>
                  After your 3 free months, you'll be charged {planPrice}
                  {savings}. You can cancel anytime before then.
                </Text>
              </Section>

              <Text style={text}>
                💝 <strong>Thank you</strong> for being a Veil & Vibe customer! We
                hope Hunnimoon makes your wedding planning a breeze.
              </Text>
            </>
          ) : (
            <>
              <Heading style={heading}>Welcome to Hunnimoon Pro! 🎉</Heading>

              <Text style={text}>Hi {firstName},</Text>

              <Text style={text}>
                Thank you for upgrading! You now have full, unlimited access to
                Hunnimoon Pro.
              </Text>

              <Section style={planBox}>
                <Text style={planTitle}>Your Plan</Text>
                <Text style={planTypeStyle}>{planName} Plan</Text>
                <Text style={planDetails}>
                  {planPrice}
                  {savings} • Cancel anytime
                </Text>
              </Section>

              <Text style={text}>
                🎊 <strong>What's included:</strong>
              </Text>

              <ul style={list}>
                <li style={listItem}>Unlimited guests and RSVPs</li>
                <li style={listItem}>Full budget tracking</li>
                <li style={listItem}>Vendor management</li>
                <li style={listItem}>Priority support</li>
              </ul>
            </>
          )}

          <Section style={buttonContainer}>
            <Button style={button} href={`${baseUrl}/dashboard`}>
              Go to Dashboard
            </Button>
          </Section>

          <Text style={text}>
            Need help or have questions? Just reply to this email or reach out at{' '}
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
              <br />
              You can manage your subscription anytime in{' '}
              <Link href={`${baseUrl}/settings`} style={footerLink}>
                Settings
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default SubscriptionSuccessEmail;

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

const planBox = {
  backgroundColor: '#FEF3F2',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
  textAlign: 'center' as const,
};

const planTitle = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#6b7280',
  textTransform: 'uppercase' as const,
  margin: '0 0 8px',
};

const planTypeStyle = {
  fontSize: '24px',
  fontWeight: '700',
  color: '#E91E63',
  margin: '0 0 8px',
};

const planDetails = {
  fontSize: '15px',
  lineHeight: '22px',
  color: '#374151',
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

const footerLink = {
  color: '#E91E63',
  textDecoration: 'underline',
};
