import { Tajawal } from "next/font/google";
import "./globals.css";

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "700", "800"],
  variable: "--font-tajawal", 
  display: "swap",
});

export const metadata = {
  title: "Pay Per View",
  description: "منصة Pay Per View",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" className={tajawal.variable}>
      <body className="font-sans antialiased bg-black overflow-x-hidden" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}