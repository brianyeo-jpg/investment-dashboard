import "./globals.css";

export const metadata = {
  title: "Investment Dashboard",
  description: "Track your portfolios in real-time",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
