import { sdk } from "@lib/config"
import { getRegion } from "@lib/data/regions"
import ProductPreview from "@modules/products/components/product-preview"
import { Pagination } from "@modules/store/components/pagination"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { sortProducts } from "@lib/util/sort-products"

// 🔧 AGREGADO: Interfaces de TypeScript
interface CategoryChild {
  id: string
  name: string
  handle: string
}

interface ProductCategory {
  id: string
  name: string
  category_children?: CategoryChild[] | null
}

interface CategoryResponse {
  product_category: ProductCategory
}

interface ProductCategoryRef {
  id: string
  name?: string
}

const PRODUCT_LIMIT = 12

// 🔧 AGREGADO: Función helper para verificar subcategorías
function hasSubcategories(category: ProductCategory | null | undefined): boolean {
  return Boolean(category?.category_children && category.category_children.length > 0)
}

// 🔧 AGREGADO: Función helper para obtener IDs de subcategorías
function getSubcategoryIds(category: ProductCategory): string[] {
  if (!hasSubcategories(category)) {
    return []
  }
  return category.category_children!.map((child: CategoryChild) => child.id)
}

// 🔧 AGREGADO: Función helper para obtener categorías de un producto
function getProductCategoryIds(product: any): string[] {
  return product.categories?.map((cat: ProductCategoryRef) => cat.id) || []
}

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
      
      productsResponse = await sdk.store.product.list({
        region_id: region.id,
        collection_id: [collectionId], // 🔧 Habilitar filtro de colección
        limit: 100,
        fields: "*variants.calculated_price",
      }, { next: { tags: ["products"] } })

      console.log("📦 Productos encontrados para colección:", productsResponse.products.length)

    } else if (categoryId) {
      console.log("🔍 Buscando productos para categoría:", categoryId)
      
      // 🔧 MEJORADO: Obtener subcategorías primero
      let categoryIds = [categoryId]
      
      try {
        // 🔧 CORREGIDO: Usar fetch directo para obtener categorías con subcategorías
        const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
        const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
        
        const categoryResponse = await fetch(
          `${backendUrl}/store/product-categories/${categoryId}?fields=+category_children`,
          {
            headers: {
              "x-publishable-api-key": publishableKey || "",
              "Content-Type": "application/json",
            },
            next: { revalidate: 300 }
          }
        )
        
        if (categoryResponse.ok) {
          const categoryData: CategoryResponse = await categoryResponse.json()
          const category = categoryData.product_category
          
          // 🔧 CORREGIDO: Usar función helper para verificación segura
          if (hasSubcategories(category)) {
            const childIds = getSubcategoryIds(category)
            categoryIds.push(...childIds)
            console.log("👶 Subcategorías encontradas:", childIds)
          }
        }
        
        console.log("📋 Filtrando por categorías:", categoryIds)
      } catch (categoryError) {
        console.warn("⚠️ No se pudieron obtener subcategorías:", categoryError)
        // Continuar solo con la categoría padre
      }

      // 🔧 CORREGIDO: Habilitar filtro de categoría
      productsResponse = await sdk.store.product.list({
        region_id: region.id,
        category_id: categoryIds, // 🔧 Usar array de categorías (padre + hijos)
        limit: 100,
        fields: "*variants.calculated_price",
      }, { next: { tags: ["products"] } })

      console.log("📦 Productos encontrados para categoría(s):", productsResponse.products.length)

    } else if (productsIds && productsIds.length > 0) {
      console.log("🔍 Buscando productos específicos:", productsIds)
      
      productsResponse = await sdk.store.product.list({
        region_id: region.id,
        id: productsIds,
        limit: 100,
        fields: "*variants.calculated_price",
      }, { next: { tags: ["products"] } })

      console.log("📦 Productos específicos encontrados:", productsResponse.products.length)

    } else {
      console.log("🔍 Buscando todos los productos")
      productsResponse = await sdk.store.product.list({
        region_id: region.id,
        limit: 100,
        fields: "*variants.calculated_price",
      }, { next: { tags: ["products"] } })
    }

    let { products, count } = productsResponse

    console.log("📊 Productos finales antes de ordenar:", products.length)

    // 🔧 MEJORADO: Verificar que los productos tengan las categorías correctas
    if (categoryId) {
      console.log("🔍 Verificando productos por categoría...")
      products.forEach(product => {
        // 🔧 CORREGIDO: Usar función helper para obtener categorías
        const productCategories = getProductCategoryIds(product)
        console.log(`📄 Producto: ${product.title}`)
        console.log(`   Categorías: [${productCategories.join(', ')}]`)
        console.log(`   Buscado: ${categoryId}`)
        console.log(`   Match: ${productCategories.includes(categoryId)}`)
      })
    }

    // Ordenar productos si es necesario
    if (sortBy && sortBy !== "created_at") {
      products = sortProducts(products, sortBy)
      console.log("🔄 Productos ordenados por:", sortBy)
    }

    // Paginación manual
    const startIndex = (page - 1) * PRODUCT_LIMIT
    const endIndex = startIndex + PRODUCT_LIMIT
    const paginatedProducts = products.slice(startIndex, endIndex)

    const totalPages = Math.ceil(count / PRODUCT_LIMIT)

    console.log("📖 Paginación:", {
      page,
      startIndex,
      endIndex,
      totalProducts: products.length,
      paginatedProducts: paginatedProducts.length,
      totalPages
    })

    return (
      <>
        {/* 🔧 Debug info mejorada - solo en desarrollo */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded text-sm">
            <p><strong>🐛 Debug Info:</strong></p>
            <p>Collection ID: {collectionId || 'No especificado'}</p>
            <p>Category ID: {categoryId || 'No especificado'}</p>
            <p>Productos encontrados: {products.length}</p>
            <p>Productos en página: {paginatedProducts.length}</p>
            <p>Página actual: {page}/{totalPages}</p>
            <p>Sort: {sortBy || 'created_at'}</p>
          </div>
        )}

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

        {/* 🔧 Mensaje mejorado cuando no hay productos */}
        {paginatedProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              📦
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No se encontraron productos
            </h3>
            <div className="text-sm text-gray-500 space-y-1">
              {collectionId && <p>Collection ID: {collectionId}</p>}
              {categoryId && <p>Category ID: {categoryId}</p>}
              {!collectionId && !categoryId && <p>Intenta ajustar los filtros</p>}
            </div>
          </div>
        )}

        {/* 🔧 Paginación mejorada */}
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
        <h3 className="text-lg font-medium text-red-800 mb-2">
          Error cargando productos
        </h3>
        <p className="text-red-600 mb-4">
          {error instanceof Error ? error.message : 'Error desconocido'}
        </p>
        
        {/* 🔧 Solo mostrar detalles en desarrollo */}
        {process.env.NODE_ENV === 'development' && (
          <details className="text-left">
            <summary className="cursor-pointer text-sm font-medium">
              Ver detalles del error
            </summary>
            <pre className="text-xs mt-2 p-2 bg-red-100 rounded overflow-auto">
              {JSON.stringify(error, null, 2)}
            </pre>
          </details>
        )}
        
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Recargar página
        </button>
      </div>
    )
  }
}