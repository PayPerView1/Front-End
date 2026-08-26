import "./globals.css";

export const metadata = {
  title: "Pay Per View",
  description: "منصة Pay Per View",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}