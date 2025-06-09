import { getCategoriesList } from "@lib/data/categories"
import { getCollectionsList } from "@lib/data/collections"
import { Text, clx } from "@medusajs/ui"
import Image from "next/image"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default async function Footer() {
  const { collections } = await getCollectionsList(0, 6)
  const { product_categories } = await getCategoriesList(0, 6)

  return (
    <footer className="bg-gray-900 text-white">
      <div className="content-container">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div>
              <LocalizedClientLink href="/" className="flex items-center mb-6">
                <Image
                  src="/images/logo.png"
                  alt="Athletic BIP"
                  width={140}
                  height={45}
                  className="h-12 w-auto brightness-0 invert"
                />
              </LocalizedClientLink>
              <Text className="text-gray-400 mb-6 leading-relaxed">
                Tu tienda de confianza para equipamiento deportivo de élite. Rendimiento profesional para atletas que buscan la excelencia.
              </Text>
              <div className="flex gap-4">
                <a
                  href="https://www.instagram.com/athletic_bip"
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
                  aria-label="Síguenos en Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a
                  href="https://www.facebook.com/profile.php?id=100071575115821#"
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
                  aria-label="Síguenos en Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Categories */}
            {product_categories && product_categories?.length > 0 && (
              <div>
                <h3 className="font-bold text-lg mb-6 text-white">Categorías</h3>
                <ul className="space-y-3" data-testid="footer-categories">
                  {product_categories?.slice(0, 6).map((c) => {
                    if (c.parent_category) {
                      return
                    }

                    const children =
                      c.category_children?.map((child) => ({
                        name: child.name,
                        handle: child.handle,
                        id: child.id,
                      })) || null

                    return (
                      <li key={c.id}>
                        <LocalizedClientLink
                          className={clx(
                            "text-gray-400 hover:text-white transition-colors font-medium",
                            children && "text-white"
                          )}
                          href={`/categories/${c.handle}`}
                          data-testid="category-link"
                        >
                          {c.name}
                        </LocalizedClientLink>
                        {children && (
                          <ul className="mt-2 ml-4 space-y-2">
                            {children.slice(0, 3).map((child) => (
                              <li key={child.id}>
                                <LocalizedClientLink
                                  className="text-gray-400 hover:text-white transition-colors text-sm"
                                  href={`/categories/${child.handle}`}
                                  data-testid="category-link"
                                >
                                  {child.name}
                                </LocalizedClientLink>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}

            {/* Collections */}
            {collections && collections.length > 0 && (
              <div>
                <h3 className="font-bold text-lg mb-6 text-white">Colecciones</h3>
                <ul className="space-y-3">
                  {collections?.slice(0, 6).map((c) => (
                    <li key={c.id}>
                      <LocalizedClientLink
                        className="text-gray-400 hover:text-white transition-colors font-medium"
                        href={`/collections/${c.handle}`}
                      >
                        {c.title}
                      </LocalizedClientLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Help & Support */}
            <div>
              <h3 className="font-bold text-lg mb-6 text-white">Ayuda</h3>
              <ul className="space-y-3">
                <li>
                  <LocalizedClientLink
                    href="/contact"
                    className="text-gray-400 hover:text-white transition-colors font-medium"
                  >
                    Contacto
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/shipping"
                    className="text-gray-400 hover:text-white transition-colors font-medium"
                  >
                    Envíos
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/returns"
                    className="text-gray-400 hover:text-white transition-colors font-medium"
                  >
                    Devoluciones
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/size-guide"
                    className="text-gray-400 hover:text-white transition-colors font-medium"
                  >
                    Guía de Tallas
                  </LocalizedClientLink>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-gray-800 py-12">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4 text-white">Mantente al Día</h3>
            <Text className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Recibe las últimas novedades, ofertas exclusivas y consejos de entrenamiento directamente en tu email
            </Text>
            <div className="max-w-md mx-auto flex gap-4">
              <input
                type="email"
                placeholder="Tu email"
                className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-colors"
              />
              <button className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold rounded-lg hover:from-yellow-300 hover:to-orange-400 transition-all duration-300 transform hover:scale-105">
                Suscribirse
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Text className="text-gray-400 text-center md:text-left">
              © {new Date().getFullYear()} Athletic BIP. Todos los derechos reservados.
            </Text>
            <div className="flex gap-6">
              <LocalizedClientLink
                href="/privacy"
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Política de Privacidad
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/terms"
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Términos de Uso
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/cookies"
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Cookies
              </LocalizedClientLink>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}