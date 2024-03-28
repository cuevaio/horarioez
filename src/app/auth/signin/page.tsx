import { SignInForm } from "./form";
import { validateRequest } from "@/lib/auth/validate-request";
import { redirect } from "next/navigation";

export default async function SignUpPage() {
  const { user } = await validateRequest();

  if (user) {
    return redirect("/");
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-2">
      <SignInForm />
      <p className="">Tu calendario se creará en esta cuenta</p>
    </div>
  );
}
