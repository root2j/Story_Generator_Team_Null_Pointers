import { initialProfile } from "@/lib/initial-profile";
import { ClerkProvider } from "@clerk/nextjs";

export default async function Providers({ children }: { children: React.ReactNode }) {

  const profile = await initialProfile();

  if (!profile) {
    return (
      null
    );
  }

  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      {children}
    </ClerkProvider>
  );
}
