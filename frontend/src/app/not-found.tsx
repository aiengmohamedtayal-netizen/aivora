"use client";

import { usePathname } from "next/navigation";

export default function NotFound() {
  const pathname = usePathname();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
      <h1>404 - Page Not Found</h1>
      <p>Pathname: {pathname}</p>
    </div>
  );
}
