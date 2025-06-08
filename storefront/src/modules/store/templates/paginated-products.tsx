import { sdk } from "@lib/config"
import { getRegion } from "@lib/data/regions"
import ProductPreview from "@modules/products/components/product-preview"
import { Pagination } from "@modules/store/components/pagination"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { sortProducts } from "@lib/util/sort-products"

const PRODUCT_LIMIT = 12

export default async function PaginatedProducts({
  sortBy,
  page,
  collectionId,
  categoryId,
  productsIds,
  countryCode,
}: {
  sortBy?: SortOptions
  page: number
  collectionId?: string
  categoryId?: string
  productsIds?: string[]
  countryCode: string
}) {
  // Debug: Log de parámetros recibidos
  console.log("🐛 PaginatedProducts Debug:", {
    sortBy,
    page,
    collectionId,
    categoryId,
    productsIds,
    countryCode
  })

  const region = await getRegion(countryCode)

  if (!region) {
    console.log("❌ No se encontró región para:", countryCode)
    return (
      <div className="text-center py-8">
        <p>Región no encontrada para: {countryCode}</p>
      </div>
    )
  }

  try {
    let productsResponse

    if (collectionId) {
      console.log("🔍 Buscando productos para colección:", collectionId)
      
      // Primero intentemos sin collection_id para ver si el SDK funciona
      productsResponse = await sdk.store.product.list({
        region_id: region.id,
        limit: 100,
        fields: "*variants.calculated_price",
      }, { next: { tags: ["products"] } })

      console.log("📦 Productos encontrados (sin filtro):", productsResponse.products.length)
      
      // Filtrar manualmente por collection_id
      const filteredProducts = productsResponse.products.filter(product => {
        console.log(`🔎 Producto ${product.id} - collection_id:`, product.collection_id)
        return product.collection_id === collectionId
      })

      console.log("🎯 Productos filtrados:", filteredProducts.length)
      
      productsResponse = {
        ...productsResponse,
        products: filteredProducts,
        count: filteredProducts.length
      }

    } else if (categoryId) {
      console.log("🔍 Buscando productos para categoría:", categoryId)
      productsResponse = await sdk.store.product.list({
        region_id: region.id,
        // category_id: [categoryId], // Comentado temporalmente
        limit: 100,
        fields: "*variants.calculated_price",
      }, { next: { tags: ["products"] } })
    } else {
      console.log("🔍 Buscando todos los productos")
      productsResponse = await sdk.store.product.list({
        region_id: region.id,
        limit: 100,
        fields: "*variants.calculated_price",
      }, { next: { tags: ["products"] } })
    }

    let { products, count } = productsResponse

    console.log("📊 Productos finales:", products.length)

    // Ordenar productos si es necesario
    if (sortBy && sortBy !== "created_at") {
      products = sortProducts(products, sortBy)
    }

    // Paginación manual
    const startIndex = (page - 1) * PRODUCT_LIMIT
    const endIndex = startIndex + PRODUCT_LIMIT
    const paginatedProducts = products.slice(startIndex, endIndex)

    const totalPages = Math.ceil(count / PRODUCT_LIMIT)

    return (
      <>
        {/* Debug info visible */}
        <div className="mb-4 p-4 bg-gray-100 rounded text-sm">
          <p><strong>Debug Info:</strong></p>
          <p>Collection ID: {collectionId || 'No especificado'}</p>
          <p>Productos encontrados: {products.length}</p>
          <p>Productos en página: {paginatedProducts.length}</p>
        </div>

        <ul
          className="grid grid-cols-2 w-full small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8"
          data-testid="products-list"
        >
          {paginatedProducts.map((p) => {
            return (
              <li key={p.id}>
                <ProductPreview product={p} region={region} />
              </li>
            )
          })}
        </ul>

        {paginatedProducts.length === 0 && (
          <div className="text-center py-8">
            <p>No se encontraron productos para esta colección.</p>
            <p className="text-sm text-gray-500 mt-2">
              Collection ID buscado: {collectionId}
            </p>
          </div>
        )}

        {totalPages > 1 && (
          <Pagination
            data-testid="product-pagination"
            page={page}
            totalPages={totalPages}
          />
        )}
      </>
    )
  } catch (error) {
    console.error("❌ Error loading products:", error)
    return (
      <div className="text-center py-8 bg-red-50 border border-red-200 rounded">
        <p className="text-red-800">Error cargando productos</p>
        <pre className="text-xs mt-2 text-left">{JSON.stringify(error, null, 2)}</pre>
      </div>
    )
  }
}