import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Routes that require authentication (admin area)
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
// Routes that are always public
const isPublicRoute = createRouteMatcher([
  "/",
  "/shop(.*)",
  "/categories(.*)",
  "/products(.*)",
  "/bundles(.*)",
  "/search(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/cloudinary/sign", // Only used server-side from admin
  "/api/(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isAdminRoute(req)) {
    // Redirect unauthenticated users to sign-in, then back to admin
    const { userId } = await auth();
    if (!userId) {
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("redirect_url", req.url);
      return NextResponse.redirect(signInUrl);
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
