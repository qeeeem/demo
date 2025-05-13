import type { Metadata } from 'next'
import './globals.css'
import SideNav from './components/SideNav'

export const metadata: Metadata = {
  title: 'AI智能客服',
  description: 'Created with v0',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <div className="flex h-screen">
          <SideNav />
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
