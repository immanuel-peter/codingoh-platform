"use client";

import { ReactNode } from "react";
import { useUserPresence } from "@/hooks/useUserPresence";

interface UserPresenceProps {
  children: ReactNode;
}

export function UserPresence({ children }: UserPresenceProps) {
  useUserPresence();
  return <>{children}</>;
}
