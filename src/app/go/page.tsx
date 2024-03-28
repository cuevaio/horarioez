import { validateRequest } from "@/lib/auth/validate-request";
import { redirect } from "next/navigation";
import { Page } from "./duh";

export default async function GoPage() {
  const { user } = await validateRequest();

  if (!user) {
    return redirect("/auth/signin");
  }

  return <Page />;
}
