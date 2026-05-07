import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rakaez Real Estate Development',
  description: 'Premium real estate development - luxury living redefined',
  icons: { icon: '/images/logo.png' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
