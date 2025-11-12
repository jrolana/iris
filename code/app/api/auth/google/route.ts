import { NextResponse } from "next/server";

// Example: redirect to Express backend OAuth login
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_req: Request) {
  // Replace this with actual user ID from Supabase auth/session
  const userId = "USER_ID_HERE";

  // Express backend OAuth login endpoint
  const backendLoginUrl = `http://localhost:4000/auth/login?userId=${userId}`;

  return NextResponse.redirect(backendLoginUrl);
}
