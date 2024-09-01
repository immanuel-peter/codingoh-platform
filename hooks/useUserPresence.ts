"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export function useUserPresence() {
  const supabase = createClient();
  const pathname = usePathname(); // Detect route changes

  useEffect(() => {
    const updatePresence = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (!user || error) {
        return;
      }

      await supabase
        .from("coders")
        .update({ is_online: true, last_online: new Date().toISOString() })
        .eq("auth_id", user.id);

      const channel = supabase.channel("online-coders");
      channel
        .on("presence", { event: "sync" }, () => {
          updatePresence();
        })
        .subscribe(async (status) => {
          if (status === "SUBSCRIBED") {
            await channel.track({
              user_id: user.id,
              online_at: new Date().toISOString(),
            });
          }
        });

      const handleBeforeUnload = async () => {
        await supabase
          .from("coders")
          .update({ is_online: false })
          .eq("auth_id", user.id);
      };

      window.addEventListener("beforeunload", handleBeforeUnload);

      return () => {
        channel.unsubscribe();
        window.removeEventListener("beforeunload", handleBeforeUnload);
        handleBeforeUnload();
      };
    };

    updatePresence();
  }, [supabase, pathname]); // Listen to pathname changes for route changes

  return null;
}
