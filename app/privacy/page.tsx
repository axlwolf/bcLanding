import Link from 'next/link'
import siteMetadata from '@/data/siteMetadata'

export const metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for ALLSET Template',
}

export default function PrivacyPage() {
  const currentYear = new Date().getFullYear()

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 xl:max-w-5xl xl:px-0">
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-5xl md:leading-14 dark:text-gray-100">
            Privacy Policy
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            Last Updated: May {currentYear}
          </p>
        </div>
        <div className="items-start space-y-6 xl:grid xl:grid-cols-3 xl:space-y-0 xl:gap-x-8">
          <div className="prose dark:prose-invert max-w-none pt-8 pb-8 xl:col-span-3">
            <p>
              This Privacy Policy describes how {siteMetadata.title} ("we," "us," or "our")
              collects, uses, and shares your personal information when you visit or interact with
              our website.
            </p>

            <h2>Information We Collect</h2>
            <p>
              When you visit our website, we may collect certain information about you, including:
            </p>
            <ul>
              <li>
                <strong>Email Address:</strong> When you subscribe to our newsletter or download our
                templates.
              </li>
              <li>
                <strong>Usage Data:</strong> Information about how you use our website, including
                pages visited, time spent on the site, and other analytical data.
              </li>
              <li>
                <strong>Device Information:</strong> Information about the device you use to access
                our website, such as IP address, browser type, and operating system.
              </li>
            </ul>

            <h2>How We Use Your Information</h2>
            <p>We use the information we collect for the following purposes:</p>
            <ul>
              <li>To provide and maintain our service</li>
              <li>To notify you about updates to our templates and services</li>
              <li>To communicate with you about our products and services</li>
              <li>To send newsletters and promotional content (with your consent)</li>
              <li>To improve our website and user experience</li>
              <li>To provide customer support</li>
              <li>To share information about our development services</li>
            </ul>

            <h2>Email Communications</h2>
            <p>
              If you have subscribed to our newsletter or provided your email for other purposes, we
              may send you emails about our templates, services, updates, and occasionally sponsored
              products that we believe may be of interest to you. You can unsubscribe from these
              communications at any time by clicking the "unsubscribe" link at the bottom of any
              email we send or by visiting our{' '}
              <Link
                href="/unsubscribe"
                className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
              >
                unsubscribe page
              </Link>
              .
            </p>

            <h2>Data Sharing and Disclosure</h2>
            <p>
              We do not sell your personal information to third parties. We may share your
              information in the following circumstances:
            </p>
            <ul>
              <li>
                <strong>Service Providers:</strong> We may share your information with third-party
                service providers who help us operate our website, such as email service providers
                and analytics services.
              </li>
              <li>
                <strong>Legal Requirements:</strong> We may disclose your information if required to
                do so by law or in response to valid requests by public authorities.
              </li>
              <li>
                <strong>Business Transfers:</strong> If we are involved in a merger, acquisition, or
                sale of assets, your information may be transferred as part of that transaction.
              </li>
            </ul>

            <h2>Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information from
              unauthorized access, alteration, disclosure, or destruction. However, no method of
              transmission over the Internet or electronic storage is 100% secure, and we cannot
              guarantee absolute security.
            </p>

            <h2>Your Rights</h2>
            <p>
              Depending on your location, you may have certain rights regarding your personal
              information, including:
            </p>
            <ul>
              <li>The right to access the personal information we hold about you</li>
              <li>The right to request correction or deletion of your personal information</li>
              <li>
                The right to restrict or object to our processing of your personal information
              </li>
              <li>The right to data portability</li>
              <li>
                The right to withdraw consent at any time (where processing is based on consent)
              </li>
            </ul>
            <p>
              To exercise these rights, please contact us using the information provided in the
              "Contact Us" section below.
            </p>

            <h2>Cookies and Stored Preferences</h2>
            <p>
              Our website stores your dark/light mode preference in your browser's local storage to
              enhance your user experience and remember your display settings between visits. This
              preference is stored locally on your device and is not transmitted to our servers.
            </p>
            <p>
              Additionally, some third-party services we use (such as hosting providers or analytics
              tools) might use cookies or similar technologies to improve functionality. These
              technologies are not used to personally identify you or collect additional personal
              information beyond what is stated in this policy.
            </p>
            <p>
              Most web browsers allow you to control cookies and local storage through their
              settings preferences. Limiting or disabling these features may impact your experience
              using our website.
            </p>

            <h2>Children's Privacy</h2>
            <p>
              Our website is not intended for children under the age of 13. We do not knowingly
              collect personal information from children under 13. If you are a parent or guardian
              and you are aware that your child has provided us with personal information, please
              contact us.
            </p>

            <h2>Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes
              by posting the new Privacy Policy on this page and updating the "Last Updated" date.
              You are advised to review this Privacy Policy periodically for any changes.
            </p>

            <h2>Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at:</p>
            <p>Email: {siteMetadata.email}</p>

            <div className="mt-8 text-center">
              <Link
                href="/"
                className="border-primary-500 text-primary-500 hover:bg-primary-100 hover:border-primary-600 active:bg-primary-200 active:text-primary-600 focus:ring-primary-500 rounded-md border bg-white px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:outline-none"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
