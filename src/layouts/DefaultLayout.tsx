
// This is a read-only file, so we'll need to create a wrapper component to add our notification system

import { Suspense } from "react";
import { useEffect } from "react";
import { NavbarAvatar } from "@/components/Navbar";
import { CustomerAddedNotification } from "@/components/CustomerAddedNotification";

export function DefaultLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CustomerAddedNotification />
      {children}
    </>
  );
}
