import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24">{children}</main>
      <Footer />
    </>
  );
}
