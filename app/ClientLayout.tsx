"use client"

import { useEffect, useState } from "react";
import BottomNav from "@/components/ui/BottomNav";
import { createClient } from "@/utils/supabase";
import { useRouter, usePathname } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session && pathname !== "/login") {
        router.push("/login");
      }
      setLoading(false);
    };
    checkUser();
  }, [pathname, router, supabase.auth]);

  if (pathname === "/login") {
    return (
      <>
        {children}
        <Toaster position="top-center" richColors />
      </>
    );
  }

  return (
    <>
      {loading ? (
        <div className="flex h-screen items-center justify-center text-slate-400 font-bold tracking-widest">読み込み中...</div>
      ) : (
        <>
          <div className="pb-20 min-h-screen max-w-5xl mx-auto w-full">
            {children}
          </div>
          <BottomNav />
        </>
      )}
      <Toaster position="top-center" richColors />
    </>
  );
}
