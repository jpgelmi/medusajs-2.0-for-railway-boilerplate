import Image from "next/image"
import { Button } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

// Configuración de banners promocionales - ACTUALIZA AQUÍ
export const PROMOTIONAL_BANNERS = [
  {
    id: "summer-sale-2024",
    title: "SUMMER SALE",
    subtitle: "Hasta 40% OFF en zapatillas running seleccionadas",
    image: {
      desktop: "/images/banners/summer-sale-desktop.png", // 1920x600px
      mobile: "/images/banners/summer-sale-mobile.png"    // 800x400px
    },
    link: "/collections/sale",
    cta: "COMPRAR AHORA",
    backgroundColor: "#FF6B00",
    textColor: "#FFFFFF",
    active: true
  },
  {
    id: "nueva-coleccion-clavos",
    title: "ZAPATILLAS DE CLAVOS",
    subtitle: "Nueva colección para pista - Máxima velocidad garantizada",
    image: {
      desktop: "/images/banners/clavos-desktop.jpg", // 1920x600px
      mobile: "/images/banners/clavos-mobile.jpg"    // 800x400px
    },
    link: "/categories/zapatillas-clavos",
    cta: "VER COLECCIÓN",
    backgroundColor: "#000000",
    textColor: "#FFFFFF",
    active: false // Cambiar a true para activar
  },
  {
    id: "envio-gratis",
    title: "ENVÍO GRATIS",
    subtitle: "En compras superiores a $50.000",
    image: {
      desktop: "/images/banners/envio-gratis-desktop.jpg", // 1920x600px
      mobile: "/images/banners/envio-gratis-mobile.jpg"    // 800x400px
    },
    link: "/envios",
    cta: "MÁS INFORMACIÓN",
    backgroundColor: "#1a1a1a",
    textColor: "#FFFFFF",
    active: false // Cambiar a true para activar
  }
]

// Componente del Banner
export default function PromotionalBanner() {
  // Obtener el primer banner activo
  const activeBanner = PROMOTIONAL_BANNERS.find(banner => banner.active)
  
  // Si no hay banner activo, no mostrar nada
  if (!activeBanner) return null

  return (
    <section 
      className="relative w-full h-[400px] md:h-[600px] overflow-hidden"
      style={{ backgroundColor: activeBanner.backgroundColor || '#f5f5f5' }}
    >
      {/* Imagen de fondo */}
      <div className="absolute inset-0">
        {/* Desktop Image */}
        <div className="hidden md:block relative w-full h-full">
          <Image
            src={activeBanner.image.desktop}
            alt={activeBanner.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
        {/* Mobile Image */}
        <div className="md:hidden relative w-full h-full">
          <Image
            src={activeBanner.image.mobile}
            alt={activeBanner.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
        {/* Overlay oscuro */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
      </div>

      {/* Contenido */}
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl">
            <h2 
              className="text-3xl md:text-5xl lg:text-6xl font-black mb-4 animate-fadeIn"
              style={{ color: activeBanner.textColor || '#FFFFFF' }}
            >
              {activeBanner.title}
            </h2>
            <p 
              className="text-lg md:text-xl lg:text-2xl mb-8 opacity-90 animate-fadeIn animation-delay-200"
              style={{ color: activeBanner.textColor || '#FFFFFF' }}
            >
              {activeBanner.subtitle}
            </p>
            <div className="animate-fadeIn animation-delay-400">
              <LocalizedClientLink href={activeBanner.link}>
                <Button
                  size="large"
                  className={`
                    font-bold px-8 md:px-10 py-4 md:py-5 rounded-full 
                    transform hover:scale-105 transition-all duration-300 shadow-2xl
                    ${activeBanner.textColor === '#FFFFFF' 
                      ? 'bg-white text-black hover:bg-gray-100' 
                      : 'bg-black text-white hover:bg-gray-800'
                    }
                  `}
                >
                  {activeBanner.cta}
                </Button>
              </LocalizedClientLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}