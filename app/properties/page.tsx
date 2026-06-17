import { Suspense } from "react";
import { getProperties } from "../data/properties";
import PropertiesClient from "./PropertiesClient";

export const revalidate = 60;

export default async function PropertiesPage() {
  const properties = await getProperties();

  return (
    <Suspense fallback={null}>
      <PropertiesClient properties={properties} />
    </Suspense>
  );
}