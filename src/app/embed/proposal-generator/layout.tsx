export default function ProposalGeneratorEmbedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white">{children}</body>
    </html>
  );
}
