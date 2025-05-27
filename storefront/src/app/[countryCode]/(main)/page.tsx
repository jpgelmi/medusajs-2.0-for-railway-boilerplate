import { Metadata } from "next"
import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import { getCollectionsWithProducts } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"

export const metadata: Metadata = {
  title: "Athletic BIP - Equipamiento Deportivo de Élite",
  description: "Descubre el mejor equipamiento deportivo para atletas profesionales.",
}

export default async function Home({
  params: { countryCode },
}: {
  params: { countryCode: string }
}) {
  console.log("PAGE.TSX IS RUNNING")
  
  const collections = await getCollectionsWithProducts(countryCode)
  const region = await getRegion(countryCode)

  console.log("Collections:", collections)
  console.log("Region:", region)

  return (
    <>
      <Hero />
      {collections && collections.length > 0 && region && (
        <div className="py-12">
          <ul className="flex flex-col gap-x-6">
            <FeaturedProducts collections={collections} region={region} />
          </ul>
        </div>
      )}
      {(!collections || collections.length === 0) && (
        <div className="py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">¡Próximamente!</h2>
          <p className="text-gray-600">Estamos preparando nuestros productos para ti.</p>
        </div>
      )}
    </>
  )
}