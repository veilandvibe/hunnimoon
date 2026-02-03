import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface FeedbackNotificationProps {
  name: string;
  email: string;
  category: string;
  message: string;
  userId?: string;
  weddingId?: string;
  baseUrl?: string;
}

const getCategoryLabel = (category: string) => {
  const labels: Record<string, string> = {
    general: 'General Message',
    feedback: 'Feedback',
    feature: 'Feature Request',
    bug: 'Bug Report',
  };
  return labels[category] || category;
};

export const FeedbackNotificationEmail = ({
  name = 'User',
  email = 'user@example.com',
  category = 'general',
  message = 'No message provided',
  userId,
  weddingId,
  baseUrl = 'https://hunnimoon.app',
}: FeedbackNotificationProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container style={container}>
        <Img
          src={`${baseUrl}/hunnimoon%20full%20logo%201.png`}
          width="174"
          height="auto"
          alt="Hunnimoon"
          style={logo}
        />

        <Heading style={heading}>New Feedback Received</Heading>

        <Section style={infoSection}>
          <Text style={infoLabel}>From:</Text>
          <Text style={infoValue}>{name} ({email})</Text>

          <Text style={infoLabel}>Category:</Text>
          <Text style={infoValue}>{getCategoryLabel(category)}</Text>

          <Text style={infoLabel}>Date:</Text>
          <Text style={infoValue}>{new Date().toLocaleString('en-US', {
            dateStyle: 'long',
            timeStyle: 'short',
          })}</Text>

          {userId && (
            <>
              <Text style={infoLabel}>User ID:</Text>
              <Text style={infoValue}>{userId}</Text>
            </>
          )}

          {weddingId && (
            <>
              <Text style={infoLabel}>Wedding ID:</Text>
              <Text style={infoValue}>{weddingId}</Text>
            </>
          )}
        </Section>

        <Section style={messageSection}>
          <Text style={messageLabel}>Message:</Text>
          <Text style={messageText}>{message}</Text>
        </Section>

        <Section style={footer}>
          <Text style={footerText}>
            © 2026 Hunnimoon. All rights reserved.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default FeedbackNotificationEmail;

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
  margin: '0 0 32px',
};

const infoSection = {
  backgroundColor: '#FEF3F2',
  borderLeft: '4px solid #E91E63',
  borderRadius: '4px',
  padding: '20px',
  margin: '0 0 24px',
};

const infoLabel = {
  fontSize: '13px',
  fontWeight: '600',
  color: '#6b7280',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  margin: '0 0 4px',
};

const infoValue = {
  fontSize: '16px',
  color: '#1f2937',
  margin: '0 0 16px',
};

const messageSection = {
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  padding: '20px',
  margin: '0 0 24px',
};

const messageLabel = {
  fontSize: '13px',
  fontWeight: '600',
  color: '#6b7280',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  margin: '0 0 12px',
};

const messageText = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#374151',
  margin: '0',
  whiteSpace: 'pre-wrap' as const,
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
