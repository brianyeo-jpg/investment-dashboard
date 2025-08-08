export const metadata = {
  title: "Investment Dashboard",
  description: "Track your portfolios in real-time",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
