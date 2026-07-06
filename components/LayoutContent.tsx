"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";

const PUBLIC_ROUTES = ["/", "/login", "/signup"];

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isPublic = PUBLIC_ROUTES.includes(pathname);

  if (isPublic) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen">{children}</main>
    </div>
  );
}
