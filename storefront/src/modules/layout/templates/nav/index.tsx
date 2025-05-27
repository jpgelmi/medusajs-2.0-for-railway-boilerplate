import { Suspense } from "react"
import Image from "next/image"
import { Search, Heart, ShoppingCart } from 'lucide-react'

// Asegúrate que estas importaciones sean correctas para Medusa v2
// y que listRegions funcione como esperas o reemplázala si es necesario.
// Con Medusa v2, podrías usar el medusa-js-client para obtener regiones.
// import { medusaClient } from "@lib/config"; // Ejemplo de cómo podrías obtener el cliente
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"

export default async function Nav() {
  // Ejemplo de cómo podrías obtener regiones con Medusa v2 JS Client si `listRegions` es de v1:
  // const { regions } = await medusaClient.regions.list().catch(() => ({ regions: [] }));
  // Por ahora, mantendremos tu `listRegions` asumiendo que está adaptada o la adaptarás.
  const regions = await listRegions().then((regions) => regions as StoreRegion[])

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200/50">
        <div className="content-container">
          <div className="flex items-center justify-between py-2 text-sm text-gray-600">
            <div className="hidden md:block font-medium">✨ Envío gratis en compras superiores a $99</div>
            <div className="flex items-center gap-6">
              <LocalizedClientLink
                href="/help" // Página personalizada: app/(main)/help/page.tsx
                className="hover:text-gray-900 transition-colors"
              >
                Ayuda
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/track-order" // Página personalizada: app/(main)/track-order/page.tsx
                className="hover:text-gray-900 transition-colors"
              >
                Seguir pedido
              </LocalizedClientLink>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="relative bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <nav className="content-container">
          <div className="flex items-center justify-between py-4">
            {/* Left section - Menu + Logo */}
            <div className="flex items-center gap-8">
              <div className="lg:hidden">
                {/* Asegúrate que SideMenu también use los hrefs actualizados */}
                <SideMenu regions={regions} />
              </div>
              
              <LocalizedClientLink
                href="/" // El logo apunta a la página de inicio
                className="flex items-center"
                data-testid="nav-store-link"
              >
                <Image 
                  src="/images/logo.png" 
                  alt="Athletic BIP" 
                  width={140} 
                  height={45} 
                  className="h-12 w-auto" 
                />
              </LocalizedClientLink>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-8">
                {/* Enlace a la página principal de la tienda (listado de productos) */}
                <LocalizedClientLink
                  href="/store" // Ruta por defecto para la tienda en Medusa starter
                  className="text-gray-700 hover:text-black font-semibold text-lg transition-colors relative group"
                  data-testid="nav-store-page-link"
                >
                  Tienda
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                </LocalizedClientLink>

                <LocalizedClientLink
                  href="/categories/men" // Ruta para la categoría 'men'
                  className="text-gray-700 hover:text-black font-semibold text-lg transition-colors relative group"
                  data-testid="nav-categories-men-link"
                >
                  Hombre
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                </LocalizedClientLink>
                <LocalizedClientLink
                  href="/categories/women" // Ruta para la categoría 'women'
                  className="text-gray-700 hover:text-black font-semibold text-lg transition-colors relative group"
                  data-testid="nav-categories-women-link"
                >
                  Mujer
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                </LocalizedClientLink>
                <LocalizedClientLink
                  href="/categories/kids" // Ruta para la categoría 'kids'
                  className="text-gray-700 hover:text-black font-semibold text-lg transition-colors relative group"
                  data-testid="nav-categories-kids-link"
                >
                  Niños
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                </LocalizedClientLink>
                
                {/* Cambiamos "Marcas" por "Colecciones" */}
                <LocalizedClientLink
                  href="/collections" // Ruta para ver todas las colecciones
                  className="text-gray-700 hover:text-black font-semibold text-lg transition-colors relative group"
                  data-testid="nav-collections-link"
                >
                  Colecciones 
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                </LocalizedClientLink>

                <LocalizedClientLink 
                  href="/collections/sale" // Asumiendo que tienes una colección con handle 'sale' para ofertas
                  className="text-red-600 hover:text-red-700 font-bold text-lg transition-colors"
                  data-testid="nav-sale-link"
                >
                  OFERTAS
                </LocalizedClientLink>
              </nav>
            </div>

            {/* Right section - Search, Account, Wishlist, Cart */}
            <div className="flex items-center gap-4">
              {/* Search Bar - Desktop */}
              {process.env.NEXT_PUBLIC_FEATURE_SEARCH_ENABLED && (
                <div className="hidden md:flex items-center relative">
                  <Search className="absolute left-4 h-5 w-5 text-gray-400" />
                  <LocalizedClientLink
                    href="/search" // Ruta estándar para búsqueda
                    className="block"
                    scroll={false}
                    data-testid="nav-search-link"
                  >
                    <input
                      type="text"
                      placeholder="Buscar productos..."
                      className="pl-12 pr-4 py-3 w-80 h-12 rounded-full border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors bg-white"
                      readOnly
                    />
                  </LocalizedClientLink>
                </div>
              )}

              {/* Search Icon - Mobile */}
              {process.env.NEXT_PUBLIC_FEATURE_SEARCH_ENABLED && (
                <LocalizedClientLink
                  href="/search"
                  className="md:hidden h-12 w-12 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                  scroll={false}
                  data-testid="nav-search-link-mobile"
                >
                  <Search className="h-6 w-6 text-gray-600" />
                </LocalizedClientLink>
              )}

              {/* Account - Desktop */}
              <LocalizedClientLink
                href="/account" // Ruta estándar para la cuenta del cliente
                className="hidden sm:flex items-center text-gray-700 hover:text-black font-medium transition-colors"
                data-testid="nav-account-link"
              >
                Cuenta
              </LocalizedClientLink>

              {/* Wishlist */}
              <LocalizedClientLink
                href="/wishlist" // Página personalizada: app/(main)/wishlist/page.tsx (necesitarás implementar esta funcionalidad)
                className="h-12 w-12 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                data-testid="nav-wishlist-link"
              >
                <Heart className="h-6 w-6 text-gray-600" />
              </LocalizedClientLink>

              {/* Cart */}
              <Suspense
                fallback={
                  <LocalizedClientLink
                    className="relative h-12 w-12 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                    href="/cart" // Ruta estándar para el carrito
                    data-testid="nav-cart-link"
                  >
                    <ShoppingCart className="h-6 w-6 text-gray-600" />
                    <span className="absolute -top-1 -right-1 h-6 w-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                      0
                    </span>
                  </LocalizedClientLink>
                }
              >
                <CartButton />
              </Suspense>

              {/* Mobile Menu: Eliminé el segundo SideMenu aquí, ya que tienes uno a la izquierda. */}
              {/* Si este tenía un propósito diferente, puedes restaurarlo. */}
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}