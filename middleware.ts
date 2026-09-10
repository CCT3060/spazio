import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/admin/login",
  },
});

export const config = {
  // Protect all /admin routes EXCEPT /admin/login
  matcher: ["/admin/((?!login).*)"],
};
