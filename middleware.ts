import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/"]);

export default clerkMiddleware(async (auth, req) => {
  const authResult = await auth();
  const { userId, redirectToSignIn } = authResult;

  // Handle sign-out first
  if (req.nextUrl.pathname === "/sign-out") {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // Check for guest cookie
  const isGuest = req.cookies.get("guest_user")?.value === "true";

  // If the user isn't signed in and the route is private, but they're a guest, let them through
  if (!userId && isProtectedRoute(req) && isGuest) {
    return NextResponse.next();
  }

  // If the user isn't signed in and the route is private, redirect to sign-in
  if (!userId && isProtectedRoute(req)) {
    return redirectToSignIn({ returnBackUrl: "/" });
  }

  // If the user is logged in and the route is protected, let them view
  if (userId && isProtectedRoute(req)) {
    return NextResponse.next();
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
