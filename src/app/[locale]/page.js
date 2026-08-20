import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function Home() {
  // التحقق من وجود التوكن في الكوكيز (server-side)
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  if (token) {
    redirect("/dashboard");
  } else {
    redirect("/login");
  }
}
