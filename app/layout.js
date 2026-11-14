import './globals.css';

export const metadata = {
  title: 'Med+',
  description: 'Clinic management system',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
