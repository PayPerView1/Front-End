import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function Home({ params }) {
  const { locale } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;
  const user = cookieStore.get("user")?.value;

  if (token && user) {
    redirect(`/${locale}/dashboard`);
  } else {
    redirect(`/${locale}/login`);
  }
}
