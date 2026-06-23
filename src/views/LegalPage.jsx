import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  FiFileText,
  FiLock,
  FiRefreshCw,
  FiHome,
  FiAlertCircle,
  FiCalendar,
  FiUser,
  FiPlus,
} from 'react-icons/fi';
import ViewsLayout from './Layout';

/* ── Reusable content helpers ── */
const Section = ({ title, children, last }) => (
  <div style={{ paddingBottom: '22px', marginBottom: last ? 0 : '22px', borderBottom: last ? 'none' : '1px solid #f0f0f0' }}>
    <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#1a1a1a', margin: '0 0 10px' }}>{title}</h3>
    <div style={{ fontSize: '14px', color: '#555', lineHeight: 1.7 }}>{children}</div>
  </div>
);

const List = ({ items }) => (
  <ul style={{ margin: '12px 0 0', padding: 0, listStyle: 'none' }}>
    {items.map((item, i) => (
      <li key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px', fontSize: '14px', color: '#555', lineHeight: 1.6 }}>
        <span style={{ color: '#E8A317', flexShrink: 0 }}>•</span>
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

const Quote = ({ children }) => (
  <div
    style={{
      background: '#FFF3D6',
      borderRadius: '10px',
      padding: '18px 20px',
      margin: '0 0 22px',
      display: 'flex',
      gap: '14px',
      alignItems: 'flex-start',
    }}
  >
    <span style={{ fontSize: '26px', color: '#E8A317', lineHeight: 1, fontWeight: 700 }}>"</span>
    <p style={{ margin: 0, fontSize: '14px', color: '#444', lineHeight: 1.7, fontWeight: 500 }}>{children}</p>
  </div>
);

/* ── Tab content definitions ── */
const TABS = [
  {
    key: 'terms',
    label: 'Terms',
    icon: <FiFileText size={15} />,
    title: 'Terms & Conditions',
    content: (
      <>
        <Section title="1. Acceptance of Terms">
          By accessing or using the Fulltime Photographers platform, you agree to be
          bound by these Terms and Conditions and all applicable laws and regulations.
          If you do not agree with any part of these terms, you must not use our platform.
        </Section>

        <Quote>
          These Terms and Conditions govern your use of our platform, website, mobile
          applications, and all related services offered by Fulltime Photographers.
        </Quote>

        <Section title="2. About Our Platform">
          Full Time Photographers Pvt Ltd is an online platform that connects clients looking
          for photographers, videographers, studios, editors, makeup artists, wedding vendors,
          and creative professionals with freelancers, agencies, studios, and vendors who
          provide photography and related services. The platform includes:
          <List
            items={[
              'Wedding and baby photography booking',
              'Studio rental booking and photographer listings',
              'Vendor marketplace and portfolio showcase',
              'Lead generation services and subscription plans',
              'Online payments and advertising services',
            ]}
          />
        </Section>

        <Section title="3. Eligibility">
          You must be at least 18 years old to use our platform. By registering, you confirm
          that the information provided is accurate, you have legal authority to enter
          agreements, and you will use the platform lawfully.
        </Section>

        <Section title="4. User Accounts">
          Users may create accounts as a Client, Photographer, Studio Owner, Vendor, Agency,
          or Freelancer. You agree to:
          <List
            items={[
              'Provide accurate, current, and complete information.',
              'Maintain the confidentiality of your account credentials.',
              'Notify us immediately of any unauthorized use of your account.',
              'Accept responsibility for all activities that occur under your account.',
            ]}
          />
          We reserve the right to suspend or terminate accounts for fake information,
          fraudulent activity, abuse or harassment, copyright violations, or policy violations.
        </Section>

        <Section title="5. Booking & Payments">
          Clients may book services directly through the platform. Payments may include
          booking amounts, advance payments, subscription charges, platform convenience
          fees, and applicable taxes. By accepting bookings, vendors agree to deliver
          services professionally, maintain quality standards, arrive on scheduled dates,
          and complete work ethically.
          <br /><br />
          The Company is not responsible for delays caused by vendors, event cancellations,
          personal disputes between users, or quality disagreements after service completion.
        </Section>

        <Section title="6. Intellectual Property">
          All content on this platform, including text, graphics, logos, icons, images,
          and software, is the property of Fulltime Photographers or its licensors and is
          protected by copyright, trademark, and other intellectual property laws. You may
          not copy, reproduce, distribute, or create derivative works without our prior
          written consent.
        </Section>

        <Section title="7. Limitation of Liability">
          The platform acts as a marketplace and technology provider. To the fullest extent
          permitted by law, Fulltime Photographers shall not be liable for vendor behavior,
          service quality disputes, financial losses, indirect damages, data interruptions,
          or third-party platform issues. Maximum liability shall not exceed the amount paid
          in the previous transaction.
        </Section>

        <Section title="8. Governing Law" last>
          These Terms shall be governed by the laws of India. Any disputes shall be subject
          to the jurisdiction of courts located in Rajkot, Gujarat, India.
        </Section>
      </>
    ),
  },
  {
    key: 'privacy',
    label: 'Privacy',
    icon: <FiLock size={15} />,
    title: 'Privacy Policy',
    content: (
      <>
        <Quote>
          Full Time Photographers Pvt Ltd respects your privacy and is committed to
          protecting your personal information in accordance with applicable laws.
        </Quote>

        <Section title="1. Information We Collect">
          We may collect the following types of information:
          <List
            items={[
              'Personal Information: Name, phone number, email address, address, business details, GST information, and payment details.',
              'Technical Information: IP address, browser type, device information, usage data, and cookies.',
              'Uploaded Content: Photos, videos, portfolios, reviews, and messages.',
            ]}
          />
        </Section>

        <Section title="2. How We Use Your Information">
          We use collected information for:
          <List
            items={[
              'Account creation and booking management',
              'Customer support and service improvements',
              'Marketing campaigns and notifications',
              'Fraud prevention and analytics',
            ]}
          />
        </Section>

        <Section title="3. Data Sharing">
          We may share your information with vendors, clients, payment providers, legal
          authorities when required by law, and technology service providers. We do not
          sell your personal data to any third party.
        </Section>

        <Section title="4. Data Security">
          We implement reasonable security measures to protect your information. However,
          no online system is completely secure, and we cannot guarantee absolute security
          of data transmitted over the internet.
        </Section>

        <Section title="5. Cookies">
          We may use cookies and analytics tools to improve user experience and track
          platform usage. You may disable cookies through your browser settings, though
          this may affect certain platform features.
        </Section>

        <Section title="6. Your Rights">
          You may request:
          <List
            items={[
              'Access to your personal data held by us',
              'Correction of inaccurate information',
              'Account deletion and data removal',
              'Opt-out from marketing communications',
            ]}
          />
          To exercise these rights, contact us at support@yourdomain.com.
        </Section>

        <Section title="7. Data Retention">
          We retain your information as necessary for legal compliance, business operations,
          fraud prevention, and dispute resolution. Data is deleted or anonymized once it
          is no longer required for these purposes.
        </Section>

        <Section title="8. Children's Privacy">
          Our services are not intended for users under 18 years of age. We do not
          knowingly collect personal data from minors.
        </Section>

        <Section title="9. Policy Updates" last>
          We may update this Privacy Policy at any time. Continued use of the platform
          after changes are posted constitutes your acceptance of the updated policy.
          Please review this page periodically for any updates.
        </Section>
      </>
    ),
  },
  {
    key: 'refunds',
    label: 'Refund & Cancellation Policy',
    icon: <FiRefreshCw size={15} />,
    title: 'Refund & Cancellation Policy',
    content: (
      <>
        <Quote>
          Refund eligibility depends on cancellation timing, vendor policies, subscription
          type, and payment gateway deductions. Please read this policy carefully before
          making a booking.
        </Quote>

        <Section title="1. Booking Cancellations">
          The following rules apply when cancelling a booking:
          <List
            items={[
              'Cancellation before vendor confirmation may qualify for a partial or full refund.',
              'Cancellation after vendor confirmation may involve applicable deductions.',
              'Emergency cancellations will be reviewed on a case-by-case basis.',
              'Custom editing, album design, travel bookings, and reserved dates are generally non-refundable.',
            ]}
          />
        </Section>

        <Section title="2. Subscription Refunds">
          Monthly and yearly subscriptions are generally non-refundable once activated.
          If you believe you were charged in error, please contact our support team within
          7 days of the charge at support@yourdomain.com.
        </Section>

        <Section title="3. Platform Convenience Fees">
          Platform convenience fees are non-refundable in all cases, regardless of the
          cancellation reason or timing.
        </Section>

        <Section title="4. Payment Gateway Charges">
          Payment gateway and processing charges may be deducted from any approved refund
          amounts. These charges are set by third-party payment providers and are outside
          our control.
        </Section>

        <Section title="5. Refund Processing Timeline" last>
          Approved refunds will be processed within 7–14 business days. The amount will
          be credited back to the original payment method. Processing times may vary
          depending on your bank or payment provider.
        </Section>
      </>
    ),
  },
  {
    key: 'vendor',
    label: 'Vendor Policy',
    icon: <FiHome size={15} />,
    title: 'Vendor Policy',
    content: (
      <>
        <Quote>
          Vendors on the Fulltime Photographers platform are expected to maintain the
          highest standards of professionalism, quality, and ethical conduct.
        </Quote>

        <Section title="1. Vendor Obligations">
          By listing your services on our platform, you agree to:
          <List
            items={[
              'Provide genuine, accurate, and up-to-date portfolio content.',
              'Maintain professionalism in all client communications and interactions.',
              'Deliver the services you have committed to in a timely and ethical manner.',
              'Respect copyright laws when using images, music, or any third-party content.',
              'Avoid engaging in direct off-platform fraud or bypassing platform payments.',
            ]}
          />
        </Section>

        <Section title="2. Reviews & Ratings">
          Vendors must not solicit, create, or manipulate reviews. Fake reviews or
          incentivized ratings are strictly prohibited. Genuine client feedback helps
          maintain trust across the platform, and violations may result in immediate
          suspension.
        </Section>

        <Section title="3. Commission & Fees">
          Vendors agree to pay applicable booking commissions, monthly listing fees,
          advertising fees, featured profile charges, or premium membership fees as
          communicated by the platform. Fees may be updated with prior notice.
        </Section>

        <Section title="4. Booking Acceptance">
          Once a booking is accepted, vendors are committed to delivering the service.
          Repeated last-minute cancellations or no-shows will be treated as policy
          violations and may result in account suspension.
        </Section>

        <Section title="5. Account Suspension" last>
          Repeated client complaints, fake reviews, fraudulent activity, or violations
          of community or copyright policies may result in permanent suspension from the
          platform without prior notice.
        </Section>
      </>
    ),
  },
  {
    key: 'copyright',
    label: 'Copyright',
    icon: <span style={{ fontWeight: 700, fontSize: '14px', lineHeight: 1 }}>©</span>,
    title: 'Copyright Policy',
    content: (
      <>
        <Quote>
          All platform content, including logos, branding, design, graphics, software,
          website structure, and text, belongs to Full Time Photographers Pvt Ltd unless
          otherwise stated.
        </Quote>

        <Section title="1. Platform Intellectual Property">
          Users may not copy, reproduce, distribute, resell, or create derivative works
          from any platform content without prior written permission from Full Time
          Photographers Pvt Ltd. This includes:
          <List
            items={[
              'Copying or reproducing platform designs or branding',
              'Using our logos or trademarks without permission',
              'Reselling or redistributing platform data',
              'Scraping content for commercial purposes',
            ]}
          />
        </Section>

        <Section title="2. User-Uploaded Content">
          Users confirm they own the rights to all content they upload — including photos,
          videos, portfolios, and business information. By uploading content, users grant
          Full Time Photographers Pvt Ltd a non-exclusive, worldwide license to display,
          promote, and market such content on our platform and social media channels.
        </Section>

        <Section title="3. Copyright Infringement Takedown">
          If you believe any content on our platform violates your copyright, please
          contact us immediately at:{' '}
          <a href="mailto:copyright@yourdomain.com" style={{ color: '#E8A317', fontWeight: 600 }}>
            copyright@yourdomain.com
          </a>
          <br /><br />
          Your notice must include:
          <List
            items={[
              'Proof of original ownership of the copyrighted work',
              'The URL or location of the infringing content on our platform',
              'Your identity proof and contact information',
              'A statement confirming the information is accurate',
            ]}
          />
        </Section>

        <Section title="4. Action on Valid Claims" last>
          Upon receiving a valid copyright complaint, we will investigate and may remove
          or restrict access to the infringing content. Repeated copyright violations by
          a user may result in permanent account suspension.
        </Section>
      </>
    ),
  },
  {
    key: 'community',
    label: 'Community Guidelines',
    icon: <FiUser size={15} />,
    title: 'Community Guidelines',
    content: (
      <>
        <Quote>
          Fulltime Photographers is a professional community built on trust, respect, and
          creativity. These guidelines help ensure a safe and welcoming experience for everyone.
        </Quote>

        <Section title="1. Respectful Conduct">
          All users — clients, vendors, photographers, and agencies — are expected to:
          <List
            items={[
              'Treat other users with respect and professionalism at all times.',
              'Avoid abusive, threatening, or discriminatory language.',
              'Refrain from harassment, stalking, or intimidation of any kind.',
              'Engage honestly and transparently in all platform interactions.',
            ]}
          />
        </Section>

        <Section title="2. Honest Engagement">
          Our platform depends on authentic connections. You must not:
          <List
            items={[
              'Create fake profiles or impersonate other users or businesses.',
              'Submit fake leads, inquiries, or booking requests.',
              'Engage in price manipulation, bid rigging, or anti-competitive behavior.',
              'Attempt to take transactions off-platform to bypass fees or protections.',
            ]}
          />
        </Section>

        <Section title="3. Content Standards">
          All content shared on the platform — including photos, portfolios, reviews, and
          messages — must be appropriate, accurate, and relevant. Content that is offensive,
          illegal, defamatory, or violates copyright will be removed.
        </Section>

        <Section title="4. Reviews & Feedback">
          Reviews must be based on genuine personal experiences. Fake reviews, incentivized
          ratings, or defamatory comments are prohibited and may result in legal action.
        </Section>

        <Section title="5. Consequences of Violations" last>
          Violations of community guidelines may result in content removal, temporary
          suspension, or permanent account ban depending on the severity and frequency of
          the violation. We reserve the right to take action without prior notice.
        </Section>
      </>
    ),
  },
  {
    key: 'disclaimer',
    label: 'Disclaimer',
    icon: <FiAlertCircle size={15} />,
    title: 'Disclaimer',
    content: (
      <>
        <Quote>
          Full Time Photographers Pvt Ltd is a technology platform that facilitates
          connections between users and vendors. We do not directly provide photography
          or any creative services.
        </Quote>

        <Section title="1. Platform Role">
          Our platform acts solely as a marketplace and technology intermediary. We are
          not a photography agency, studio, or service provider. All services are delivered
          independently by registered vendors, photographers, and creative professionals.
        </Section>

        <Section title="2. No Guarantees">
          We do not guarantee:
          <List
            items={[
              'Booking availability or vendor response times',
              'Revenue generation or business growth for vendors',
              'Specific service quality or exact creative outcomes',
              'Continuous platform uptime or uninterrupted access',
              'Accuracy of vendor portfolios or listed information',
            ]}
          />
        </Section>

        <Section title="3. Vendor Verification">
          While we take reasonable steps to verify vendor profiles, users are advised to
          independently verify vendors, review portfolios, check references, and confirm
          service terms before finalizing any booking or payment.
        </Section>

        <Section title="4. Third-Party Links">
          Our platform may contain links to third-party websites or services. We are not
          responsible for the content, policies, or practices of any third-party websites.
          Visiting such links is at your own discretion and risk.
        </Section>

        <Section title="5. Limitation of Liability" last>
          To the fullest extent permitted by applicable law, Full Time Photographers Pvt
          Ltd shall not be liable for any indirect, incidental, special, or consequential
          damages arising from your use of the platform or any services booked through it.
          Our maximum liability shall not exceed the amount paid to the platform in your
          most recent transaction.
        </Section>
      </>
    ),
  },
  {
    key: 'additional',
    label: 'Suggested Additional Policies',
    icon: <FiPlus size={15} />,
    title: 'Suggested Additional Policies',
    content: (
      <>
        <Quote>
          As your platform grows, these additional policies are recommended to protect
          your business and build user trust. Consider adding dedicated pages for each.
        </Quote>

        <Section title="Recommended Policy Pages">
          The following dedicated policy pages should be created and linked in your
          website footer:
          <List
            items={[
              'Shipping Policy — if you sell physical products like prints or albums',
              'Cookie Policy — explaining how cookies are used and user consent options',
              'Advertisement Policy — for any sponsored listings or promoted content',
              'DMCA / Copyright Takedown Policy — a dedicated page with takedown procedures',
              'Affiliate Disclosure — if you use referral links or partner commissions',
              'Studio Rental Rules — specific terms for studio bookings and usage',
              'Vendor Agreement — detailed contract terms for registered vendors',
              'Freelancer Agreement — specific terms for individual freelance photographers',
              'Data Processing Agreement (DPA) — for GDPR or enterprise compliance',
              'AI Generated Content Policy — if AI tools are used in any platform content',
            ]}
          />
        </Section>

        <Section title="Why These Matter" last>
          Each of these policies serves a specific legal or trust-building purpose.
          Dedicated pages make your platform appear more professional and are often
          required by payment gateways, app stores, or enterprise clients. We strongly
          recommend having a qualified legal professional draft or review each of these
          documents before going live.
        </Section>
      </>
    ),
  },
  {
    key: 'imp',
    label: 'Important Startup Recommendation',
    icon: <FiAlertCircle size={15} />,
    title: 'Important Startup Recommendation',
    content: (
      <>
        <Quote>
          Before launching your platform publicly, ensure you have completed the following
          steps to protect your business legally and build credibility with users.
        </Quote>

        <Section title="Legal & Compliance Checklist">
          Take these steps before your public launch:
          <List
            items={[
              'Get all policies reviewed by a qualified lawyer familiar with Indian IT and e-commerce law.',
              'Add your GST registration number to the footer and invoices.',
              'Add your CIN (Company Identification Number) from MCA registration.',
              'Add your registered office address on all legal documents and the website footer.',
              'Add a working support email address — currently set as support@yourdomain.com.',
              'Complete payment gateway legal requirements including KYC and merchant agreements.',
              'Define and add platform-specific cancellation rules for each service category.',
              'Add a consent checkbox during user sign-up that explicitly links to your Terms and Privacy Policy.',
            ]}
          />
        </Section>

        <Section title="Footer Requirements">
          All of the following should be clearly visible and linked from your website footer:
          <List
            items={[
              'Terms & Conditions',
              'Privacy Policy',
              'Refund & Cancellation Policy',
              'Copyright Policy',
              'Community Guidelines',
              'Contact / Support email',
              'Registered company address and CIN',
            ]}
          />
        </Section>

        <Section title="A Note on These Documents" last>
          These policy documents are provided as a starting template and should not be
          treated as final legal advice. Requirements vary based on your specific services,
          user base, and applicable regulations. Please consult a licensed legal professional
          before publishing these documents on your platform.
        </Section>
      </>
    ),
  },
];

/* ── Page ── */
const LegalPage = () => {
  const location = useLocation();
  const initialTab = TABS.some(t => t.key === location.state?.tab) ? location.state.tab : 'terms';
  const [activeTab, setActiveTab] = useState(initialTab);

  const current = TABS.find(t => t.key === activeTab);

  return (
    <ViewsLayout>
      <div style={{ width: '100%', margin: '30px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: '#FFF3D6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              color: '#E8A317',
            }}
          >
            {current.icon}
          </div>

          <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#1a1a1a', margin: '0 0 12px' }}>
            {current.title}
          </h1>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13.5px',
              color: '#555',
              fontWeight: 500,
            }}
          >
            <FiCalendar size={14} style={{ color: '#E8A317' }} />
            Effective Date: <span style={{ color: '#E8A317', fontWeight: 700 }}>24 May 2026</span>
          </div>

          <p style={{ maxWidth: '620px', margin: '14px auto 0', fontSize: '13.5px', color: '#888', lineHeight: 1.7 }}>
            Welcome to Fulltime Photographers ("we", "us", or "our"). By accessing or using
            our website, mobile applications, services, or platform, you agree to comply
            with and be bound by these policies.
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: '#fff',
            border: '1px solid #ececec',
            borderRadius: '16px',
            overflow: 'hidden',
            marginLeft: '20px',
            marginRight: '20px',
          }}
        >
          {/* Tabs */}
          <div
            style={{
              display: 'flex',
              overflowX: 'auto',
              borderBottom: '1px solid #f0f0f0',
              padding: '0 12px',
            }}
          >
            {TABS.map(tab => {
              const active = tab.key === activeTab;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '7px',
                    background: 'none',
                    border: 'none',
                    borderBottom: active ? '2px solid #E8A317' : '2px solid transparent',
                    padding: '16px 16px 14px',
                    fontSize: '13.5px',
                    fontWeight: 700,
                    color: active ? '#E8A317' : '#888',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    fontFamily: 'inherit',
                    transition: 'color 0.15s, border-color 0.15s',
                  }}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div style={{ padding: '32px 36px' }}>
            {current.content}
          </div>
        </div>
      </div>
    </ViewsLayout>
  );
};

export default LegalPage;