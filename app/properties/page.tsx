import { Suspense } from "react";
import PropertiesClient from "./PropertiesClient";

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ backgroundColor: "#F8F5F0" }} />}>
      <PropertiesClient />
    </Suspense>
  );
}
