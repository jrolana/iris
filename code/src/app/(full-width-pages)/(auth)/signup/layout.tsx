import TanStackProvider from "@/providers/TanStackProvider";

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TanStackProvider>{children}</TanStackProvider>;
}
