import "./globals.css";
import { Geist, Geist_Mono, Tajawal } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
});

export const metadata = {
  title: "Pay Per View",
  description: "منصة Pay Per View",
  icons: {
    icon: [
      { url: "/logo1.png", sizes: "64x64", type: "image/png" },
      { url: "/logo1.png", sizes: "64x64", type: "image/png" },
    ],
    shortcut: "/logo1.png",
    apple: [
      { url: "/logo1.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default async function RootLayout({ children, params }) {
  const { locale = "ar" } = await params;
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${geistSans.variable} ${geistMono.variable} ${tajawal.variable} h-full antialiased dark`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col font-tajawal">
        {children}
      </body>
    </html>
  );
}