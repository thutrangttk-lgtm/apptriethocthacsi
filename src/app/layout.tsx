import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Triết Học Thạc Sĩ - Philosophy Learning Platform",
  description: "Hệ thống học tập, chủ động ôn luyện và chấm thi Triết học Thạc sĩ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="antialiased bg-slate-950 text-slate-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
