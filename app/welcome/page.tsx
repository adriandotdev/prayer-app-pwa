import { redirect } from "next/navigation";

// The landing page now lives at "/" for signed-out visitors.
export default function WelcomePage() {
  redirect("/");
}
