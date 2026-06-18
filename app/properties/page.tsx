import { Suspense } from "react";
import { getProperties, getCities } from "../data/properties";
import PropertiesClient from "./PropertiesClient";

export const revalidate = 60;

export default async function PropertiesPage() {
  const [properties, cities] = await Promise.all([
    getProperties(),
    getCities(),
  ]);

  return (
    <Suspense fallback={null}>
      <PropertiesClient properties={properties} cities={cities} />
    </Suspense>
  );
}