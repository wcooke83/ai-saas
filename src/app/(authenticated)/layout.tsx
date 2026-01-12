/**
 * Authenticated Layout
 * For pages that require user authentication
 * Middleware handles the auth check, this just wraps the content
 */

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
