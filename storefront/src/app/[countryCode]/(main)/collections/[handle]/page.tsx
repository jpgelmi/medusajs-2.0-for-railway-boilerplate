import { Metadata } from "next"
import { notFound } from "next/navigation"

import {
  getCollectionByHandle,
  getCollectionsList,
} from "@lib/data/collections"
import { listRegions } from "@lib/data/regions"
import { StoreCollection, StoreRegion } from "@medusajs/types"
import CollectionTemplate from "@modules/collections/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

type Props = {
  params: { handle: string; countryCode: string }
  searchParams: {
    page?: string
    sortBy?: SortOptions
  }
}

export const PRODUCT_LIMIT = 12

export async function generateStaticParams() {
  const { collections } = await getCollectionsList()

  if (!collections) {
    return []
  }

  const countryCodes = await listRegions().then(
    (regions: StoreRegion[]) =>
      regions
        ?.map((r) => r.countries?.map((c) => c.iso_2))
        .flat()
        .filter(Boolean) as string[]
  )

  const collectionHandles = collections.map(
    (collection: StoreCollection) => collection.handle
  ).filter(Boolean) // Filtrar handles undefined

  const staticParams = countryCodes
    ?.map((countryCode: string) =>
      collectionHandles.map((handle: string) => ({
        countryCode,
        handle,
      }))
    )
    .flat()

  return staticParams
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const collection = await getCollectionByHandle(params.handle)

    if (!collection) {
      return {
        title: "Colección no encontrada",
        description: "La colección solicitada no existe",
      }
    }

    const metadata = {
      title: `${collection.title} | Athletic BIP`,
      description: collection.metadata?.description as string || `Productos de la colección ${collection.title}`,
    } as Metadata

    return metadata
  } catch (error) {
    console.error("Error generating metadata:", error)
    return {
      title: "Colección | Athletic BIP",
      description: "Explora nuestra colección de productos",
    }
  }
}

export default async function CollectionPage({ params, searchParams }: Props) {
  const { sortBy, page } = searchParams

  try {
    const collection = await getCollectionByHandle(params.handle)

    if (!collection) {
      console.log("Collection not found for handle:", params.handle)
      notFound()
    }

    console.log("🎯 Collection loaded successfully:", {
      id: collection.id,
      title: collection.title,
      handle: collection.handle
    })

    return (
      <CollectionTemplate
        collection={collection}
        page={page}
        sortBy={sortBy}
        countryCode={params.countryCode}
      />
    )
  } catch (error) {
    console.error("Error in CollectionPage:", error)
    notFound()
  }
}