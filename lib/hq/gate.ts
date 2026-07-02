import { getSession } from "@/lib/auth/session";

// The AI HQ is gated to the main operator + any admin/superadmin.
export const HQ_MAIN_USER = "mike@rocketopp.com";

export async function getHqUser() {
  const user = await getSession();
  if (!user) return null;
  const email = (user.email || "").toLowerCase();
  const ok =
    email === HQ_MAIN_USER ||
    // @ts-expect-error role/is_admin exist on the row
    user.is_admin === true || user.role === "admin" || user.role === "superadmin";
  return ok ? user : null;
}
