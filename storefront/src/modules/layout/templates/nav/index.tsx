"use client"

import { Suspense, useEffect, useState } from "react"
import Image from "next/image"
import { Search, Heart, ShoppingCart, ChevronDown } from 'lucide-react'

// Imports para Medusa v2
import { listRegions } from "@lib/data/regions"
import { listCategories } from "@lib/data/categories"
import { getCollections } from "@lib/data/collections"
import { StoreRegion, ProductCategoryDTO } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"

// LOG BÁSICO - ESTO DEBE APARECER SIEMPRE
console.log("🚀 ARCHIVO NAV.TSX CARGADO - SI VES ESTO, EL ARCHIVO SE ESTÁ USANDO")

// Definir tipos para mejor tipado
interface Collection {
  id: string;
  title: string;
  handle: string;
  created_at?: string;
  updated_at?: string;
}

interface Category {
  id: string;
  name: string;
  handle: string;
  description?: string;
  parent_category_id?: string | null;
  category_children?: Category[];
  rank?: number;
  created_at?: string;
  updated_at?: string;
  metadata?: any;
  parent_category?: Category | null;
}

export default function Nav() {
  console.log("🔍 NAVBAR: Iniciando carga de datos...")
  
  // Estado para datos
  const [regions, setRegions] = useState<StoreRegion[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)

  // Función mejorada para categorías (usando el método que funciona)
  const getCategories = async (): Promise<Category[]> => {
    try {
      console.log("🔄 Obteniendo categorías con método directo...")
      const response = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/product-categories?limit=100&fields=+category_children`, {
        headers: {
          'x-publishable-api-key': process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '',
        },
      })
      const data = await response.json()
      console.log("📂 Categories loaded successfully:", data.product_categories?.length || 0)
      console.log("📂 Categories data:", data.product_categories)
      return data.product_categories || []
    } catch (error) {
      console.error("❌ Error loading categories:", error)
      return []
    }
  }

  // Cargar datos al montar el componente
  useEffect(() => {
    const loadData = async () => {
      try {
        // Obtener datos dinámicos desde Medusa
        const [regionsData, categoriesData, collectionsData] = await Promise.all([
          listRegions().then((regions) => regions as StoreRegion[]),
          getCategories(), // Usar nuestra función que funciona
          getCollections().then((cols) => {
            console.log("📚 Collections loaded successfully:", cols?.length || 0)
            console.log("📚 Collections data:", cols)
            return cols as Collection[]
          }).catch((error) => {
            console.error("❌ Error loading collections:", error)
            return []
          })
        ])

        setRegions(regionsData)
        setCategories(categoriesData)
        setCollections(collectionsData)
        setLoading(false)
      } catch (error) {
        console.error("❌ Error loading navbar data:", error)
        setLoading(false)
      }
    }

    loadData()
  }, [])
  
  // Si está cargando, mostrar navbar básico
  if (loading) {
    return (
      <div className="sticky top-0 inset-x-0 z-50">
        <header className="relative bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
          <nav className="content-container">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-4 lg:gap-8">
                <LocalizedClientLink href="/" className="flex items-center">
                  <Image 
                    src="/images/logo.png" 
                    alt="Athletic BIP" 
                    width={140} 
                    height={45} 
                    className="h-8 w-auto lg:h-12" 
                  />
                </LocalizedClientLink>
                <div className="hidden lg:flex items-center gap-6">
                  <div className="h-6 w-20 bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-6 w-20 bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-6 w-24 bg-gray-200 animate-pulse rounded"></div>
                </div>
              </div>
              <div className="flex items-center gap-2 lg:gap-4">
                <div className="h-10 w-10 bg-gray-200 animate-pulse rounded-full"></div>
                <div className="h-10 w-10 bg-gray-200 animate-pulse rounded-full"></div>
              </div>
            </div>
          </nav>
        </header>
      </div>
    )
  }

  // Filtrar categorías principales (las que no tienen parent)
  const mainCategories = categories.filter((cat: Category) => !cat.parent_category_id)
  
  // Encontrar categorías específicas por handle
  const menCategory = categories.find(
    (cat: Category) =>
      cat.handle === "men" ||
      cat.handle === "hombre" ||
      cat.handle === "hombres"
  )
  const womenCategory = categories.find(
    (cat: Category) =>
      cat.handle === "women" ||
      cat.handle === "mujer" ||
      cat.handle === "mujeres"
  )
  const shoesCategory = categories.find(
    (cat: Category) =>
      cat.handle === "zapatillas" ||
      cat.handle === "shoes" ||
      cat.handle === "calzado"
  )
  const spikesCategory = categories.find(
    (cat: Category) =>
      cat.handle === "zapatillas-clavos" ||
      cat.handle === "spikes" ||
      cat.handle === "track-shoes" ||
      cat.handle === "clavos"
  )

  // Colección de ofertas
  const saleCollection = collections.find(
    (col: Collection) =>
      col.handle === "sale" ||
      col.handle === "ofertas" ||
      col.handle === "descuentos"
  )

  // DEBUG: Ver qué datos tenemos disponibles
  console.log("🔍 DEBUG NAVBAR:")
  console.log("Total categories found:", categories.length)
  console.log("All categories:", categories.map((cat: Category) => ({ name: cat.name, handle: cat.handle, id: cat.id })))
  console.log("Main categories (no parent):", mainCategories.map((cat: Category) => ({ name: cat.name, handle: cat.handle })))
  console.log("Total collections found:", collections.length)
  console.log("All collections:", collections.map((col: Collection) => ({ title: col.title, handle: col.handle })))
  console.log("Men category found:", !!menCategory, menCategory?.name)
  console.log("Women category found:", !!womenCategory, womenCategory?.name)
  console.log("Shoes category found:", !!shoesCategory, shoesCategory?.name)
  console.log("Spikes category found:", !!spikesCategory, spikesCategory?.name)
  console.log("Sale collection found:", !!saleCollection, saleCollection?.title)

  // Función para obtener subcategorías específicas de una categoría padre
  const getSubcategoriesByHandles = (parentCategory: Category | undefined, handles: string[]) => {
    if (!parentCategory?.category_children) return []
    return parentCategory.category_children.filter((sub: Category) => 
      handles.some(handle => sub.handle?.includes(handle))
    )
  }

  // Función para crear estructura de subcategorías para hombres/mujeres
  const createGenderSubcategories = (genderCategory: Category | undefined) => {
    if (!genderCategory?.category_children) return []

    const subcategories: Category[] = []
    const children = genderCategory.category_children

    // Buscar subcategorías específicas
    const shoes = children.find(
      (sub: Category) =>
        sub.handle?.includes("zapatillas") || sub.handle?.includes("shoes")
    )
    const spikes = children.find(
      (sub: Category) =>
        sub.handle?.includes("clavos") ||
        sub.handle?.includes("spikes") ||
        sub.handle?.includes("track")
    )
    const shirts = children.find(
      (sub: Category) =>
        sub.handle?.includes("poleras") ||
        sub.handle?.includes("shirts") ||
        sub.handle?.includes("camisetas")
    )
    const pants = children.find(
      (sub: Category) =>
        sub.handle?.includes("pantalones") || sub.handle?.includes("pants")
    )
    const shorts = children.find((sub: Category) => sub.handle?.includes("shorts"))
    const accessories = children.find(
      (sub: Category) =>
        sub.handle?.includes("accesorios") ||
        sub.handle?.includes("accessories")
    )

    // Agregar en orden específico
    if (shoes) subcategories.push(shoes)
    if (spikes) subcategories.push(spikes)
    if (shirts) subcategories.push(shirts)
    if (pants) subcategories.push(pants)
    if (shorts) subcategories.push(shorts)
    if (accessories) subcategories.push(accessories)

    // Agregar otras subcategorías que no hayamos incluido
    const includedIds = subcategories.map((sub: Category) => sub.id)
    const others = children.filter((sub: Category) => !includedIds.includes(sub.id))

    return [...subcategories, ...others.slice(0, 3)] // Limitar extras
  }

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      {/* Main header */}
      <header className="relative bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <nav className="content-container">
          <div className="flex items-center justify-between py-4">
            {/* Left section - Menu + Logo */}
            <div className="flex items-center gap-4 lg:gap-8">
              {/* Mobile Menu */}
              <div className="lg:hidden">
                <SideMenu regions={regions} />
              </div>
              
              <LocalizedClientLink
                href="/"
                className="flex items-center"
                data-testid="nav-store-link"
              >
                <Image 
                  src="/images/logo.png" 
                  alt="Athletic BIP" 
                  width={140} 
                  height={45} 
                  className="h-8 w-auto lg:h-12" 
                />
              </LocalizedClientLink>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-6">
                
                {/* HOMBRES - Dropdown con distintivo azul */}
                {menCategory && (
                  <div 
                    className="relative"
                    onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                      const dropdown = e.currentTarget.querySelector('.dropdown-content-hombres') as HTMLElement;
                      const chevron = e.currentTarget.querySelector('.chevron-hombres') as HTMLElement;
                      if (dropdown) {
                        dropdown.classList.remove('opacity-0', 'invisible');
                        dropdown.classList.add('opacity-100', 'visible');
                      }
                      if (chevron) {
                        chevron.classList.add('rotate-180');
                      }
                    }}
                    onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                      const dropdown = e.currentTarget.querySelector('.dropdown-content-hombres') as HTMLElement;
                      const chevron = e.currentTarget.querySelector('.chevron-hombres') as HTMLElement;
                      if (dropdown) {
                        dropdown.classList.add('opacity-0', 'invisible');
                        dropdown.classList.remove('opacity-100', 'visible');
                      }
                      if (chevron) {
                        chevron.classList.remove('rotate-180');
                      }
                    }}
                  >
                    <button className="flex items-center gap-2 text-blue-700 hover:text-blue-900 font-bold text-base transition-colors relative px-3 py-2 rounded-md hover:bg-blue-50">
                      HOMBRES
                      <ChevronDown className="chevron-hombres h-4 w-4 transition-transform duration-200" />
                    </button>
                    
                    {/* Dropdown para hombres */}
                    <div className="dropdown-content-hombres absolute top-full left-0 mt-2 w-64 bg-white border border-blue-200 rounded-lg shadow-xl opacity-0 invisible transition-all duration-200 z-50">
                      <div className="py-3 border-l-4 border-blue-500">
                        <div className="px-4 py-2 bg-blue-50 text-blue-800 font-bold text-sm uppercase tracking-wide border-b border-blue-100">
                          HOMBRES
                        </div>
                        <LocalizedClientLink
                          href={`/categories/${menCategory.handle}`}
                          className="block px-4 py-3 text-blue-700 hover:bg-blue-50 hover:text-blue-900 transition-colors font-medium border-b border-blue-50"
                        >
                          Ver todo Hombres
                        </LocalizedClientLink>
                        
                        {/* Subcategorías específicas para hombres */}
                        <LocalizedClientLink
                          href={`/categories/zapatillas-hombre`}
                          className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-800 transition-colors"
                        >
                          Zapatillas Hombres
                        </LocalizedClientLink>
                        <LocalizedClientLink
                          href={`/categories/clavos-hombre`}
                          className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-800 transition-colors"
                        >
                          Zapatillas de Clavos
                        </LocalizedClientLink>
                        <LocalizedClientLink
                          href={`/categories/poleras-hombre`}
                          className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-800 transition-colors"
                        >
                          Poleras Hombres
                        </LocalizedClientLink>
                        <LocalizedClientLink
                          href={`/categories/pantalones-hombre`}
                          className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-800 transition-colors"
                        >
                          Pantalones Hombres
                        </LocalizedClientLink>
                        <LocalizedClientLink
                          href={`/categories/shorts-hombre`}
                          className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-800 transition-colors"
                        >
                          Shorts Hombres
                        </LocalizedClientLink>
                      </div>
                    </div>
                  </div>
                )}

                {/* MUJERES - Dropdown con distintivo rosa */}
                {womenCategory && (
                  <div 
                    className="relative"
                    onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                      const dropdown = e.currentTarget.querySelector('.dropdown-content-mujeres') as HTMLElement;
                      const chevron = e.currentTarget.querySelector('.chevron-mujeres') as HTMLElement;
                      if (dropdown) {
                        dropdown.classList.remove('opacity-0', 'invisible');
                        dropdown.classList.add('opacity-100', 'visible');
                      }
                      if (chevron) {
                        chevron.classList.add('rotate-180');
                      }
                    }}
                    onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                      const dropdown = e.currentTarget.querySelector('.dropdown-content-mujeres') as HTMLElement;
                      const chevron = e.currentTarget.querySelector('.chevron-mujeres') as HTMLElement;
                      if (dropdown) {
                        dropdown.classList.add('opacity-0', 'invisible');
                        dropdown.classList.remove('opacity-100', 'visible');
                      }
                      if (chevron) {
                        chevron.classList.remove('rotate-180');
                      }
                    }}
                  >
                    <button className="flex items-center gap-2 text-pink-700 hover:text-pink-900 font-bold text-base transition-colors relative px-3 py-2 rounded-md hover:bg-pink-50">
                      MUJERES
                      <ChevronDown className="chevron-mujeres h-4 w-4 transition-transform duration-200" />
                    </button>
                    
                    {/* Dropdown para mujeres */}
                    <div className="dropdown-content-mujeres absolute top-full left-0 mt-2 w-64 bg-white border border-pink-200 rounded-lg shadow-xl opacity-0 invisible transition-all duration-200 z-50">
                      <div className="py-3 border-l-4 border-pink-500">
                        <div className="px-4 py-2 bg-pink-50 text-pink-800 font-bold text-sm uppercase tracking-wide border-b border-pink-100">
                          MUJERES
                        </div>
                        <LocalizedClientLink
                          href={`/categories/${womenCategory.handle}`}
                          className="block px-4 py-3 text-pink-700 hover:bg-pink-50 hover:text-pink-900 transition-colors font-medium border-b border-pink-50"
                        >
                          Ver todo Mujeres
                        </LocalizedClientLink>
                        
                        {/* Subcategorías específicas para mujeres */}
                        <LocalizedClientLink
                          href={`/categories/zapatillas-mujer`}
                          className="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-800 transition-colors"
                        >
                          Zapatillas Mujeres
                        </LocalizedClientLink>
                        <LocalizedClientLink
                          href={`/categories/clavos-mujer`}
                          className="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-800 transition-colors"
                        >
                          Zapatillas de Clavos
                        </LocalizedClientLink>
                        <LocalizedClientLink
                          href={`/categories/poleras-mujer`}
                          className="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-800 transition-colors"
                        >
                          Poleras Mujeres
                        </LocalizedClientLink>
                        <LocalizedClientLink
                          href={`/categories/pantalones-mujer`}
                          className="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-800 transition-colors"
                        >
                          Pantalones Mujeres
                        </LocalizedClientLink>
                        <LocalizedClientLink
                          href={`/categories/shorts-mujer`}
                          className="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-800 transition-colors"
                        >
                          Shorts Mujeres
                        </LocalizedClientLink>
                      </div>
                    </div>
                  </div>
                )}

                {/* ZAPATILLAS - Enlace directo mejorado */}
                {shoesCategory && (
                  <LocalizedClientLink
                    href={`/categories/${shoesCategory.handle}`}
                    className="text-gray-700 hover:text-gray-900 font-semibold text-base transition-colors relative px-3 py-2 rounded-md hover:bg-gray-50 group"
                    data-testid="nav-shoes-link"
                  >
                    ZAPATILLAS
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-gray-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                  </LocalizedClientLink>
                )}

                {/* ZAPATILLAS DE CLAVOS - Enlace directo destacado */}
                {spikesCategory && (
                  <LocalizedClientLink
                    href={`/categories/${spikesCategory.handle}`}
                    className="text-orange-600 hover:text-orange-700 font-bold text-base transition-colors relative px-3 py-2 rounded-md hover:bg-orange-50 group"
                    data-testid="nav-spikes-link"
                  >
                    CLAVOS
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-orange-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                  </LocalizedClientLink>
                )}
              </nav>
            </div>

            {/* Right section - Search, Account, Cart */}
            <div className="flex items-center gap-2 lg:gap-4">
              {/* Search Bar - Desktop only */}
              {process.env.NEXT_PUBLIC_FEATURE_SEARCH_ENABLED && (
                <div className="hidden xl:flex items-center relative">
                  <Search className="absolute left-4 h-5 w-5 text-gray-400" />
                  <LocalizedClientLink
                    href="/search"
                    className="block"
                    scroll={false}
                    data-testid="nav-search-link"
                  >
                    <input
                      type="text"
                      placeholder="Buscar zapatillas, ropa..."
                      className="pl-12 pr-4 py-2 w-64 xl:w-80 h-10 xl:h-12 rounded-full border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors bg-white text-sm"
                      readOnly
                    />
                  </LocalizedClientLink>
                </div>
              )}

              {/* Search Icon - Tablet and Mobile */}
              {process.env.NEXT_PUBLIC_FEATURE_SEARCH_ENABLED && (
                <LocalizedClientLink
                  href="/search"
                  className="xl:hidden h-10 w-10 lg:h-12 lg:w-12 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                  scroll={false}
                  data-testid="nav-search-link-mobile"
                >
                  <Search className="h-5 w-5 lg:h-6 lg:w-6 text-gray-600" />
                </LocalizedClientLink>
              )}

              {/* Account - Desktop */}
              <LocalizedClientLink
                href="/account"
                className="hidden lg:flex items-center text-gray-700 hover:text-black font-medium transition-colors text-sm lg:text-base px-2 py-1 rounded-md hover:bg-gray-50"
                data-testid="nav-account-link"
              >
                Mi Cuenta
              </LocalizedClientLink>

              {/* Cart */}
              <Suspense
                fallback={
                  <LocalizedClientLink
                    className="relative h-10 w-10 lg:h-12 lg:w-12 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                    href="/cart"
                    data-testid="nav-cart-link"
                  >
                    <ShoppingCart className="h-5 w-5 lg:h-6 lg:w-6 text-gray-600" />
                    <span className="absolute -top-1 -right-1 h-5 w-5 lg:h-6 lg:w-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                      0
                    </span>
                  </LocalizedClientLink>
                }
              >
                <CartButton />
              </Suspense>
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}