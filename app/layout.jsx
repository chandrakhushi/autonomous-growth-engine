import "./globals.css";

export const metadata = {
  title: "Autonomous Growth Engine",
  description:
    "A system that continuously learns from real user behavior and automatically generates and deploys onboarding, SEO, and pricing improvements.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
