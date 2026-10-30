import "./globals.css";
import { Geist, Geist_Mono, Tajawal, JetBrains_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  fallback: ["system-ui", "sans-serif"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  fallback: ["monospace"],
});

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  fallback: ["Tajawal", "system-ui", "sans-serif"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  fallback: ["JetBrains Mono", "monospace"],
});

export const metadata = {
  title: "Pay Per View",
  description: "منصة Pay Per View",
  icons: {
    icon: [
      { url: "/images/logo6.png", sizes: "64x64", type: "image/png" },
      { url: "/images/logo6.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/images/logo6.png",
    apple: [
      { url: "/images/logo6.png", sizes: "180x180", type: "image/png" },
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
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${tajawal.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        {/*
          تطبيق الثيم فوراً قبل أول render لمنع وميض الألوان (Flash of Unstyled Theme).
          هذا الـ script يقرأ localStorage ويضيف/يزيل class="dark" على <html>
          قبل أن يرسم المتصفح أي شيء — لذا لا يحتاج useEffect ولا ينتظر React.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('theme');if(!s||s==='system'){var d=window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d);}else{document.documentElement.classList.toggle('dark',s==='dark');}}catch(e){}})();`,
          }}
        />
      </head>
      <body suppressHydrationWarning className="min-h-full flex flex-col font-tajawal">
        {children}
      </body>
    </html>
  );
}
