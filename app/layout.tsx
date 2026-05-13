import './globals.css'
import { ToastProvider } from '@/components/Toast'
import { UserProvider } from '@/components/UserProvider'

export const metadata = {
  title: 'autocamp by atomcamp',
  description: 'Smart Adaptive LMS — AI-powered learning for Data Science & AI',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,700;1,9..40,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ToastProvider>
          <UserProvider>
            {children}
          </UserProvider>
        </ToastProvider>
      </body>
    </html>
  )
}
