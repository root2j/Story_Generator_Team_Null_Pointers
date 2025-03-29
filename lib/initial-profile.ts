import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { RedirectToSignIn } from "@clerk/nextjs"; // Note: This is a React component

export const initialProfile = async () => {
  // Get the currently logged in user from Clerk
  const user = await currentUser();

  // If there's no user, return the Clerk sign-in component.
  // In a server action, you might consider using Next.js's `redirect()` instead.
  if (!user) {
    return RedirectToSignIn;
  }

  // Look up an existing profile in the database by userId
  const profile = await db.profile.findUnique({
    where: {
      userId: user.id,
    },
  });

  // If found, return the existing profile
  if (profile) {
    return profile;
  }

  // Otherwise, create a new profile with the user's details from Clerk
  const newProfile = await db.profile.create({
    data: {
      userId: user.id,
      name: `${user.firstName} ${user.lastName}`,
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress,
    },
  });

  // Return the newly created profile
  return newProfile;
};
