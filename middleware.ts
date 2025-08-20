import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here if needed
    console.log("Middleware: Protecting route:", req.nextUrl.pathname);
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        console.log("Middleware: Checking authorization, token:", !!token);
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*"],
};
