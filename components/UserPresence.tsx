"use client";

import { useUserPresence } from "@/hooks/useUserPresence";

export function UserPresence() {
  useUserPresence();
  return null;
}
