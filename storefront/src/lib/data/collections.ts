import { sdk } from "@lib/config"
import { cache } from "react"
import { getProductsList } from "./products"
import { HttpTypes } from "@medusajs/types"

export const retrieveCollection = cache(async function (id: string) {
  return sdk.store.collection
    .retrieve(id, {}, { next: { tags: ["collections"] } })
    .then(({ collection }) => collection)
})

export const getCollectionsList = cache(async function (
  offset: number = 0,
  limit: number = 100
): Promise<{ collections: HttpTypes.StoreCollection[]; count: number }> {
  return sdk.store.collection
    .list({ limit, offset: 0 }, { next: { tags: ["collections"] } })
    .then(({ collections }) => ({ collections, count: collections.length }))
})

export const getCollectionByHandle = cache(async function (
  handle: string
): Promise<HttpTypes.StoreCollection | null> {
  return sdk.store.collection
    .list({ handle: [handle] }, { next: { tags: ["collections"] } }) // ← Array en lugar de string
    .then(({ collections }) => collections[0] || null) // ← Agregar || null para manejar undefined
})

export const getCollectionsWithProducts = cache(
  async (countryCode: string): Promise<HttpTypes.StoreCollection[] | null> => {
    const { collections } = await getCollectionsList(0, 3)

    if (!collections) {
      return null
    }

    // Obtener productos para cada colección usando el SDK correctamente
    const collectionsWithProducts = await Promise.all(
      collections.map(async (collection) => {
        if (!collection.id) return collection

        try {
          // Usar el SDK directamente para filtrar por collection_id
          const region = await sdk.store.region.list({ limit: 1 }).then(({ regions }) => regions[0])
          
          if (!region) return collection

          const { products } = await sdk.store.product.list({
            collection_id: [collection.id], // Usar collection_id en el SDK directamente
            region_id: region.id,
            limit: 10,
            fields: "*variants.calculated_price"
          }, { next: { tags: ["products"] } })

          return {
            ...collection,
            products: products || []
          }
        } catch (error) {
          console.warn(`Error fetching products for collection ${collection.id}:`, error)
          return {
            ...collection,
            products: []
          }
        }
      })
    )

    return collectionsWithProducts as unknown as HttpTypes.StoreCollection[]
  }
)

// Función simple para la navegación
export const getCollections = cache(async function () {
  return sdk.store.collection
    .list({}, { next: { tags: ["collections"] } })
    .then(({ collections }) => collections)
})