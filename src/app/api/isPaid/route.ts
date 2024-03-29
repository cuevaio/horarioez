export const dynamic = "force-dynamic";
import { validateRequest } from "@/lib/auth/validate-request";
import { getXataClient } from "@/lib/db";

export const GET = async () => {
  const { user } = await validateRequest();

  if (!user) {
    return Response.json({ message: "No estás autenticado" }, { status: 401 });
  }

  const xata = getXataClient();
  const userXata = await xata.db.users.read(user.id);

  return Response.json({ isPaid: !!userXata?.isPaid });
};
