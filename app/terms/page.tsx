import Link from 'next/link'
import siteMetadata from '@/data/siteMetadata'

export const metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for ALLSET Template',
}

export default function TermsPage() {
  const currentYear = new Date().getFullYear()

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 xl:max-w-5xl xl:px-0">
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-5xl md:leading-14 dark:text-gray-100">
            Terms of Service
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            Last Updated: May {currentYear}
          </p>
        </div>
        <div className="items-start space-y-6 xl:grid xl:grid-cols-3 xl:space-y-0 xl:gap-x-8">
          <div className="prose dark:prose-invert max-w-none pt-8 pb-8 xl:col-span-3">
            <p>
              Please read these Terms of Service ("Terms", "Terms of Service") carefully before
              using the {siteMetadata.title} website operated by us.
            </p>
            <p>
              Your access to and use of the Service is conditioned on your acceptance of and
              compliance with these Terms. These Terms apply to all visitors, users, and others who
              access or use the Service.
            </p>
            <p>
              By accessing or using the Service, you agree to be bound by these Terms. If you
              disagree with any part of the terms, you may not access the Service.
            </p>

            <h2>Use of Our Templates</h2>
            <p>
              {siteMetadata.title} provides landing page templates and related services. When you
              download and use our templates, you are granted a non-exclusive, non-transferable
              license to use the templates for your personal or business purposes, subject to the
              following conditions:
            </p>
            <ul>
              <li>You may modify the templates to suit your needs.</li>
              <li>You may use the templates to create websites for yourself or your clients.</li>
              <li>
                You may not redistribute, resell, lease, license, sub-license, or offer the
                templates to any third party.
              </li>
              <li>
                You may not claim the templates as your own work or remove any attribution or
                copyright notices.
              </li>
            </ul>

            <h2>Intellectual Property</h2>
            <p>
              The Service and its original content, features, and functionality are and will remain
              the exclusive property of {siteMetadata.title} and its licensors. The Service is
              protected by copyright, trademark, and other laws of both the United States and
              foreign countries. Our trademarks and trade dress may not be used in connection with
              any product or service without the prior written consent of {siteMetadata.title}.
            </p>

            <h2>User Content</h2>
            <p>
              Our Service may allow you to post, link, store, share, and otherwise make available
              certain information, text, graphics, videos, or other material. You are responsible
              for the content you post and its legality.
            </p>
            <p>
              By posting content, you grant us the right to use, modify, publicly perform, publicly
              display, reproduce, and distribute such content on and through the Service. You retain
              any and all of your rights to any content you submit, post, or display on or through
              the Service and you are responsible for protecting those rights.
            </p>

            <h2>Free and Premium Services</h2>
            <p>
              {siteMetadata.title} offers both free and premium services. The availability and scope
              of the free services are at our discretion and may change without notice. Premium
              services are subject to payment of applicable fees as specified at the time of
              purchase.
            </p>

            <h2>Accounts</h2>
            <p>
              When you create an account with us, you must provide information that is accurate,
              complete, and current at all times. Failure to do so constitutes a breach of the
              Terms, which may result in immediate termination of your account on our Service.
            </p>
            <p>
              You are responsible for safeguarding the password that you use to access the Service
              and for any activities or actions under your password. You agree not to disclose your
              password to any third party. You must notify us immediately upon becoming aware of any
              breach of security or unauthorized use of your account.
            </p>

            <h2>Termination</h2>
            <p>
              We may terminate or suspend your account immediately, without prior notice or
              liability, for any reason whatsoever, including without limitation if you breach the
              Terms.
            </p>
            <p>
              Upon termination, your right to use the Service will immediately cease. If you wish to
              terminate your account, you may simply discontinue using the Service or contact us to
              request account deletion.
            </p>

            <h2>Limitation of Liability</h2>
            <p>
              In no event shall {siteMetadata.title}, nor its directors, employees, partners,
              agents, suppliers, or affiliates, be liable for any indirect, incidental, special,
              consequential, or punitive damages, including without limitation, loss of profits,
              data, use, goodwill, or other intangible losses, resulting from:
            </p>
            <ul>
              <li>Your access to or use of or inability to access or use the Service;</li>
              <li>Any conduct or content of any third party on the Service;</li>
              <li>Any content obtained from the Service; and</li>
              <li>Unauthorized access, use, or alteration of your transmissions or content.</li>
            </ul>

            <h2>Disclaimer</h2>
            <p>
              Your use of the Service is at your sole risk. The Service is provided on an "AS IS"
              and "AS AVAILABLE" basis. The Service is provided without warranties of any kind,
              whether express or implied, including, but not limited to, implied warranties of
              merchantability, fitness for a particular purpose, non-infringement, or course of
              performance.
            </p>

            <h2>Governing Law</h2>
            <p>
              These Terms shall be governed and construed in accordance with the laws of the United
              States, without regard to its conflict of law provisions.
            </p>
            <p>
              Our failure to enforce any right or provision of these Terms will not be considered a
              waiver of those rights. If any provision of these Terms is held to be invalid or
              unenforceable by a court, the remaining provisions of these Terms will remain in
              effect.
            </p>

            <h2>Changes to Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any
              time. If a revision is material, we will try to provide at least 30 days' notice prior
              to any new terms taking effect. What constitutes a material change will be determined
              at our sole discretion.
            </p>
            <p>
              By continuing to access or use our Service after those revisions become effective, you
              agree to be bound by the revised terms. If you do not agree to the new terms, please
              stop using the Service.
            </p>

            <h2>Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us at:</p>
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
