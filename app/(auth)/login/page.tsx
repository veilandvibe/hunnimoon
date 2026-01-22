'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import db from '@/lib/instant'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import PublicHeader from '@/components/marketing/PublicHeader'
import { Mail } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [sentEmail, setSentEmail] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)

  const handleOpenTermsModal = () => {
    // Remove focus from any active input to prevent validation tooltips
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
    setShowTermsModal(true)
  }

  const handleOpenPrivacyModal = () => {
    // Remove focus from any active input to prevent validation tooltips
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
    setShowPrivacyModal(true)
  }

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await db.auth.sendMagicCode({ email })
      setSentEmail(true)
    } catch (err: any) {
      setError(err.message || 'Failed to send code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await db.auth.signInWithMagicCode({ email, code })
      // Auth state will update automatically, redirect will happen in middleware
      router.push('/onboarding')
    } catch (err: any) {
      console.error('Error verifying code:', err)
      setError('Invalid code. Please check and try again.')
      setLoading(false)
    }
  }

  return (
    <>
      <PublicHeader />
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-pink-gradient-from to-pink-gradient-to">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <svg className="mx-auto mb-4 w-[280px] md:w-[434px] h-auto" viewBox="0 0 174 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M107.551 9.03731L107.707 9.73026C108.919 6.94562 113.628 6.30492 115.2 9.10422L115.666 10.3059C116.917 6.92087 122.299 5.8072 124.003 9.42778C124.824 11.1712 124.618 15.9897 124.64 18.1181C124.653 19.3592 124.629 20.6186 124.639 21.8431L118.99 21.8991L118.827 13.5204C118.512 11.6111 116.466 12.1318 116.186 13.7743L116.236 21.9779L110.633 22.0017C110.469 21.8761 110.618 20.6415 110.613 20.3399C110.587 18.3261 110.711 15.602 110.471 13.6661C110.202 11.4929 107.971 12.2491 107.823 14.0016L107.977 22.032L102.196 22.0906L102 7.86589L107.601 7.71007L107.551 9.03822V9.03731Z" fill="#CB1F70"/>
            <path d="M31.8534 2.87793L32.4171 10.1062C32.7196 9.74878 32.9075 9.29781 33.2366 8.95591C36.2604 5.82297 41.2257 7.29137 41.8462 11.812C42.2733 14.9212 42.3696 18.4492 42.5877 21.6123C42.596 21.7352 42.6391 21.8213 42.6821 21.9295L36.6326 22.3887L36.0817 14.6443C36.133 12.2282 33.2247 11.9275 32.8763 14.2768L33.6041 22.6591L27.6609 23.111L26 3.3234L31.8534 2.87793Z" fill="#CB1F70"/>
            <path d="M65.9653 7.81529C67.4062 6.01509 69.5968 5.41746 71.8104 6.04809C74.1973 6.7282 75.1588 8.91888 75.134 11.2571L74.0314 21.1986L68.0725 20.557L69.089 12.3543C69.0588 10.5211 66.561 10.2626 65.9387 11.9602C65.8177 12.2883 65.7572 12.7457 65.7022 13.0986C65.3759 15.1912 65.2081 17.4717 64.9579 19.5955C64.935 19.7916 64.968 19.9951 64.9579 20.1912L59 19.5487L60.5582 5.06641L66.0615 5.75019L66.144 5.92893L65.9662 7.81621L65.9653 7.81529Z" fill="#CB1F70"/>
            <path d="M82.2793 8.10799C82.9393 7.1483 83.7404 6.22987 84.8477 5.77249C88.1511 4.40767 91.3729 6.25737 91.7093 9.8147L92.4435 19.7397L86.4948 20.2071C86.3775 18.1118 86.2097 16.0183 86.0383 13.9266C85.9613 12.9926 86.1511 11.0237 84.8706 10.7872C83.7477 10.5801 82.9017 11.3647 82.8302 12.4618L83.3783 20.4803L77.4213 20.9404L76.4131 6.45719L82.2803 5.9998V8.10799H82.2793Z" fill="#CB1F70"/>
            <path d="M173.412 20.9408L167.594 21.6933L166.495 13.1937C166.489 13.1451 166.252 12.7033 166.197 12.6254C165.598 11.7895 164.23 12.0122 163.793 12.9105C163.752 12.9957 163.581 13.5292 163.586 13.5695L164.685 22.0691C163.373 22.268 162.04 22.3744 160.726 22.5769C160.392 22.6283 159.021 23.0591 158.816 22.8336L156.827 8.48144L162.44 7.57125L162.711 9.66202C163.105 8.93424 163.426 8.35403 164.066 7.80224C167.069 5.21834 171.352 6.6849 171.985 10.6355L173.411 20.9399L173.412 20.9408Z" fill="#CB1F70"/>
            <path d="M49.2814 5.06537V13.5439C49.2814 13.7318 49.4877 14.4092 49.6068 14.5934C49.7636 14.8363 50.0679 15.0719 50.3575 15.126C50.792 15.2066 51.1614 15.1462 51.4584 14.9821C52.1495 14.5999 52.3099 13.455 52.3099 13.455L52.3979 5.06445H58.035L57.9891 19.9134H52.4895V18.0802C51.1357 19.7447 49.2778 20.3433 47.1512 20.0729C45.263 19.8327 43.5068 18.0637 43.5068 16.1095V5.06537H49.2814Z" fill="#CB1F70"/>
            <path d="M132.488 4.04926C142.708 3.00984 143.446 18.7552 133.651 19.5114C123.656 20.2832 122.77 5.03736 132.488 4.04926ZM132.666 8.90175C129.963 9.40405 131.397 15.9018 134.222 14.3079C135.995 13.3079 135.181 8.43428 132.666 8.90175Z" fill="#CB1F70"/>
            <path d="M148.939 6.11958C154.83 6.05817 158.205 12.434 155.604 17.5588C152.54 23.5946 143.595 22.7092 141.689 16.2499C140.223 11.2782 143.652 6.17458 148.939 6.11958ZM149.839 16.1481C150.945 15.094 151.794 11.5211 149.694 11.0885C147.678 10.6733 146.639 13.753 146.855 15.3012C147.055 16.7329 148.813 17.1252 149.84 16.1472L149.839 16.1481Z" fill="#CB1F70"/>
            <path d="M100.063 8.18154L98.9618 22.1139L93.0039 21.6565L94.0222 7.64258L100.063 8.18154Z" fill="#CB1F70"/>
            <path d="M96.6477 0.0476685C99.1308 -0.289641 101.243 1.18334 100.977 3.82682C100.573 7.84886 93.0885 7.61788 93.7604 2.65998C93.952 1.24658 95.2847 0.232822 96.6477 0.0476685Z" fill="#CB1F70"/>
            <g clipPath="url(#clip0_56_7)">
              <path d="M8.19969 24.0641C8.13855 24.3681 7.68492 24.4215 7.43583 24.4377C6.63458 24.4904 5.47694 24.4872 4.67341 24.4394C4.49619 24.4289 3.90761 24.3867 3.91964 24.1347C3.93622 24.0332 3.98337 23.9799 4.06304 23.923C4.38497 23.6934 5.16509 23.3581 5.55661 23.1741C5.727 23.0941 6.55296 22.7894 6.60987 22.6918C6.70808 22.0031 6.89733 21.2626 6.79848 20.5726C5.34556 20.464 3.90078 20.2585 2.48103 19.9353C2.28755 19.8914 2.08886 19.8536 1.89733 19.8042C1.16112 19.6143 0.00151958 19.3155 0.728952 18.3415C0.996252 17.9838 1.33184 17.6622 1.59914 17.2941C2.36592 16.2389 2.93304 14.9196 3.19708 13.642C2.86702 13.6287 2.44234 13.483 2.18967 13.2684C1.937 13.0537 2.00009 12.8834 1.64629 12.7393C1.18128 12.55 0.649282 12.5165 0.289306 12.114C0.107529 11.9107 -0.108067 11.5286 0.0639546 11.2695C1.99033 9.13205 3.51251 6.66782 5.48702 4.56877C5.84959 4.18343 6.46581 3.51648 6.89636 3.24821C6.97505 3.19911 7.19422 3.12009 7.21731 3.09797C7.25015 3.06676 7.3347 2.86352 7.40364 2.7806C7.97954 2.08471 8.82631 2.44241 9.43408 2.87848C9.71894 1.75009 11.3887 1.65384 11.579 2.91099C11.8076 2.77734 12.0557 2.63524 12.3084 2.55199C13.1473 2.27559 13.8966 2.47005 14.1287 3.39844C14.1554 3.50575 14.1713 3.88979 14.1843 3.91223C14.1918 3.92524 14.2497 3.9415 14.2751 3.96621C15.4896 5.1502 16.3826 7.01804 17.2827 8.46901C18.0543 9.71283 18.812 10.7798 19.6991 11.9358C19.9323 12.2395 20.1313 12.5185 19.8149 12.8629C19.6503 13.0417 19.1034 13.4456 18.8835 13.5565C18.3847 13.8085 17.774 13.7705 17.231 13.7399C17.6017 15.1047 18.1275 16.4379 18.9587 17.5871C19.1421 17.8408 19.9436 18.7347 19.9849 18.9337C20.1228 19.6 19.3147 19.8101 18.8234 19.9346C17.96 20.1535 16.9585 20.3183 16.0733 20.4334C15.1882 20.5485 14.331 20.6272 13.4628 20.6334L13.7905 22.7276L13.8611 22.7868C14.332 22.965 14.8077 23.1503 15.2607 23.3695C15.5303 23.4999 16.165 23.8052 16.3689 23.9834C16.7487 24.3155 16.3247 24.4693 16.0083 24.4989C15.2799 24.5671 14.09 24.546 13.3473 24.5044C12.9334 24.481 12.5952 24.4563 12.4918 23.9948C12.4066 23.6147 12.4332 23.0459 12.39 22.6333C12.3227 21.9914 12.2232 21.3511 12.1324 20.7124L8.19936 20.6981V24.0638L8.19969 24.0641ZM10.0893 3.36072C10.5085 3.33861 11.3517 3.55583 11.0067 2.84888C10.6935 2.20795 9.68869 2.75588 10.0893 3.36072ZM8.67087 3.88654C8.9346 3.84297 9.304 3.91873 9.58041 3.88654C9.6513 3.88654 9.60057 3.62575 9.56415 3.57762C9.06272 3.33536 8.27025 2.46582 7.7828 3.1926C7.44006 3.70346 7.57891 4.65397 8.21594 4.8816C8.41008 4.80648 9.50432 4.70925 9.5596 4.54861L9.56415 4.11384L8.64649 4.14083C8.57365 4.12132 8.51349 4.08588 8.52194 4.00035C8.51966 3.94215 8.62665 3.89369 8.67055 3.88622L8.67087 3.88654ZM11.4811 4.11417C11.3748 4.68291 12.1207 4.81786 12.5405 4.85819C13.2953 4.9307 13.7184 4.54569 13.6569 3.77338C13.5828 2.84271 12.8465 2.85539 12.1617 3.1861C11.9126 3.30642 11.6687 3.55843 11.3832 3.56136L11.4632 3.91125L12.5672 3.8563C12.6771 3.84882 12.7665 3.99288 12.7116 4.07775C12.6501 4.1727 11.6411 4.16815 11.4814 4.11417H11.4811ZM7.77727 5.25296C7.36137 5.05394 7.10187 4.54536 7.06317 4.09726C7.04594 3.895 7.08886 3.69631 7.07911 3.49632C6.69572 4.04816 6.16795 4.47089 5.71399 4.95899C4.99209 5.73553 4.29295 6.59856 3.63868 7.43428C2.57924 8.78736 1.63263 10.2399 0.418078 11.4626C0.579368 12.2863 1.78644 12.1166 2.20723 12.6001C2.27714 12.6804 2.31291 12.7933 2.38543 12.8769C2.59029 13.1126 3.00523 13.1737 3.29399 13.2518C3.61364 11.7677 3.82078 10.2699 4.41619 8.8628C5.05257 7.35916 6.17445 5.87926 7.75711 5.31734L7.77695 5.25296H7.77727ZM10.9937 4.6995C11.0304 4.6634 10.8997 3.97889 10.8324 3.93369L10.1166 3.88654C10.1332 4.11189 9.9599 4.68844 10.2935 4.73332C10.5195 4.76388 10.7676 4.69787 10.9937 4.6995ZM14.1765 4.3096C14.0907 4.30115 14.1239 4.30798 14.1128 4.35805C14.0325 4.71771 13.7866 5.11801 13.4533 5.29198C13.3828 5.32872 13.2768 5.28125 13.3002 5.38205C13.9616 5.61196 14.5872 6.14753 15.0555 6.66587C16.7029 8.48949 16.8902 10.9622 17.1627 13.2976C17.6475 13.3084 18.228 13.3988 18.6722 13.1819C18.8078 13.1155 19.4409 12.672 19.5238 12.5712C19.675 12.3871 19.3004 12.1406 19.1814 11.9985C17.7288 10.2666 16.6417 8.10058 15.4256 6.19761C15.0184 5.56058 14.542 4.97005 14.1769 4.30895L14.1765 4.3096ZM7.73435 9.16685C5.88536 9.19091 4.86202 11.5638 5.32508 13.1542C6.10031 15.8184 9.43278 15.4178 9.97648 12.7377C10.2717 11.2822 9.477 9.14409 7.73435 9.16685ZM12.773 9.16327C10.1696 9.46016 9.7069 14.1194 12.2111 14.9105C14.0738 15.4988 15.3693 13.6407 15.3478 11.9657C15.3303 10.5882 14.3141 8.98735 12.7727 9.16327H12.773Z" fill="#CB1F70"/>
              <path d="M12.9372 10.9183C13.1727 10.9099 13.492 11.0555 13.6591 11.2181C14.5677 12.1033 13.7941 14.2209 12.5308 13.6482C11.4427 13.1549 11.7354 10.9616 12.9372 10.9183Z" fill="#CB1F70"/>
              <path d="M7.83405 10.951C9.52597 10.7302 9.38192 14.0435 7.67764 13.692C6.54958 13.4595 6.59673 11.1123 7.83405 10.951Z" fill="#CB1F70"/>
            </g>
            <defs>
              <clipPath id="clip0_56_7">
                <rect width="20" height="22.5432" fill="white" transform="translate(0 2)"/>
              </clipPath>
            </defs>
          </svg>
          <p className="text-pink-primary/70 mt-2">
            Your wedding planning journey starts here
          </p>
        </div>

        {/* Login Card */}
        <Card>
          <AnimatePresence mode="wait">
            {!sentEmail ? (
              <motion.form
                key="email-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                onSubmit={handleSendCode}
                className="space-y-6"
              >
              <div>
                <h2 className="text-2xl font-black text-pink-primary mb-2">
                  Sign In
                </h2>
                <p className="text-sm text-pink-primary/70">
                  We'll send you a magic code to sign in. No password needed!
                </p>
              </div>

              <Input
                label="Email Address"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                autoFocus
              />

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                  {error}
                </div>
              )}

              <Button type="submit" fullWidth disabled={loading}>
                <Mail size={18} />
                {loading ? 'Sending...' : 'Send Magic Code'}
              </Button>

              <p className="text-xs text-pink-primary/60 text-center">
                By signing in, you agree to our{' '}
                <button 
                  type="button"
                  onClick={handleOpenTermsModal}
                  className="text-pink-primary underline hover:text-pink-primary/80"
                >
                  Terms of Service
                </button>
                {' '}and{' '}
                <button 
                  type="button"
                  onClick={handleOpenPrivacyModal}
                  className="text-pink-primary underline hover:text-pink-primary/80"
                >
                  Privacy Policy
                </button>
              </p>
            </motion.form>
          ) : (
            <motion.form
              key="code-form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              onSubmit={handleVerifyCode}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-black text-pink-primary mb-2">
                  Check Your Email
                </h2>
                <p className="text-sm text-pink-primary/70">
                  We sent a 6-digit code to <strong>{email}</strong>
                </p>
              </div>

              <Input
                label="6-Digit Code"
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                maxLength={6}
                autoFocus
              />

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="space-y-3">
                <Button type="submit" fullWidth disabled={loading || code.length !== 6}>
                  {loading ? 'Verifying...' : 'Verify Code'}
                </Button>

                <button
                  type="button"
                  onClick={() => {
                    setSentEmail(false)
                    setCode('')
                    setError('')
                  }}
                  className="w-full text-sm text-pink-primary/70 hover:text-pink-primary transition-colors"
                >
                  Use a different email
                </button>
              </div>

              <p className="text-xs text-pink-primary/60 text-center">
                By signing in, you agree to our{' '}
                <button 
                  type="button"
                  onClick={handleOpenTermsModal}
                  className="text-pink-primary underline hover:text-pink-primary/80"
                >
                  Terms of Service
                </button>
                {' '}and{' '}
                <button 
                  type="button"
                  onClick={handleOpenPrivacyModal}
                  className="text-pink-primary underline hover:text-pink-primary/80"
                >
                  Privacy Policy
                </button>
              </p>
            </motion.form>
          )}
          </AnimatePresence>
        </Card>
      </div>
    </div>

    {/* Terms of Service Modal */}
    <Modal
      isOpen={showTermsModal}
      onClose={() => setShowTermsModal(false)}
      title="Terms of Service"
      size="xl"
    >
      <div className="prose prose-sm max-w-none space-y-4 text-pink-primary/80">
        <p className="text-xs text-pink-primary/60">Last Updated: January 17, 2026</p>
        <p>
          By accessing or using Hunnimoon, you agree to be bound by these Terms of Service. 
          Hunnimoon is a wedding planning platform operated by Veil and Vibe, a product of 1497239 B.C. LTD.
        </p>
        <p className="text-sm">
          For the complete Terms of Service, please visit{' '}
          <Link href="/terms" target="_blank" className="text-pink-primary underline">
            our full Terms page
          </Link>.
        </p>
        <div className="space-y-3">
          <div>
            <h3 className="font-bold text-pink-primary mb-1">Service Description</h3>
            <p className="text-sm">
              Hunnimoon provides wedding planning tools including guest management, RSVP tracking, 
              budget monitoring, and vendor organization.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-pink-primary mb-1">Free Trial & Billing</h3>
            <p className="text-sm">
              New users receive a 7-day free trial. No credit card required. After the trial, 
              you may subscribe to continue with full functionality.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-pink-primary mb-1">Your Content</h3>
            <p className="text-sm">
              You retain all rights to your wedding data. We store and process it only to provide the Service.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-pink-primary mb-1">Contact</h3>
            <p className="text-sm">
              Email: <a href="mailto:hunnimoon@veilandvibe.com" className="underline">hunnimoon@veilandvibe.com</a>
            </p>
          </div>
        </div>
      </div>
    </Modal>

    {/* Privacy Policy Modal */}
    <Modal
      isOpen={showPrivacyModal}
      onClose={() => setShowPrivacyModal(false)}
      title="Privacy Policy"
      size="xl"
    >
      <div className="prose prose-sm max-w-none space-y-4 text-pink-primary/80">
        <p className="text-xs text-pink-primary/60">Last Updated: January 17, 2026</p>
        <p>
          This Privacy Policy describes how we collect, use, and protect your personal information 
          when you use Hunnimoon.
        </p>
        <p className="text-sm">
          For the complete Privacy Policy, please visit{' '}
          <Link href="/privacy" target="_blank" className="text-pink-primary underline">
            our full Privacy page
          </Link>.
        </p>
        <div className="space-y-3">
          <div>
            <h3 className="font-bold text-pink-primary mb-1">Information We Collect</h3>
            <p className="text-sm">
              We collect your email, wedding details, guest information, budget data, and vendor contacts 
              that you provide to use the Service.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-pink-primary mb-1">How We Use Your Information</h3>
            <p className="text-sm">
              We use your information to provide the Service, manage your account, process RSVPs, 
              and improve user experience.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-pink-primary mb-1">We Do Not Sell Your Data</h3>
            <p className="text-sm">
              We never sell, rent, or trade your personal information to third parties for marketing purposes.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-pink-primary mb-1">Data Security</h3>
            <p className="text-sm">
              We implement encryption, secure authentication, and regular backups to protect your information.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-pink-primary mb-1">Contact</h3>
            <p className="text-sm">
              Email: <a href="mailto:hunnimoon@veilandvibe.com" className="underline">hunnimoon@veilandvibe.com</a>
            </p>
          </div>
        </div>
      </div>
    </Modal>
  </>
  )
}
