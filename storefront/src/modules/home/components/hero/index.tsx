import { Button, Heading } from "@medusajs/ui"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link" // Asegúrate de importar LocalizedClientLink

const Hero = () => {
  console.log("Hero component is rendering") // Puedes quitar esto si ya no lo necesitas para depurar
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/runners-1.png" // Asegúrate que esta imagen exista en tu carpeta /public/images
          alt="Atletas corriendo"
          fill
          className="object-cover object-center"
          priority // Bien usado para LCP
        />
        <div className="absolute inset-0 bg-black/40"></div> {/* Overlay oscuro */}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <Heading
            level="h1"
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight text-white" // text-white es explícito aquí, podrías heredarlo.
          >
            CORRE COMO UN
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
              CAMPEÓN
            </span>
          </Heading>

          <Heading
            level="h2"
            className="text-xl md:text-2xl lg:text-3xl mb-12 text-gray-200 font-light max-w-3xl mx-auto leading-relaxed"
          >
            Equipamiento deportivo de élite para atletas que buscan la excelencia. Rendimiento profesional, diseño
            innovador.
          </Heading>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button
              asChild // Clave para que el botón delegue su renderizado al Link
              size="large"
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:from-yellow-300 hover:to-orange-400 text-lg px-12 py-6 rounded-full font-bold shadow-2xl transform hover:scale-105 transition-all duration-300 border-0"
            >
              <LocalizedClientLink href="/store" data-testid="hero-explore-collection-button"> {/* Enlace a la página principal de la tienda */}
                EXPLORAR COLECCIÓN
              </LocalizedClientLink>
            </Button>
            <Button
              asChild // Clave para que el botón delegue su renderizado al Link
              size="large"
              variant="secondary" // El variant="secondary" de @medusajs/ui podría tener estilos por defecto. Tus clases los sobreescribirán o complementarán.
              className="border-2 border-white text-white hover:bg-white hover:text-black text-lg px-12 py-6 rounded-full font-bold backdrop-blur-sm bg-white/10 transform hover:scale-105 transition-all duration-300"
            >
              <LocalizedClientLink href="/collections/sale" data-testid="hero-view-offers-button"> {/* Enlace a la colección de ofertas */}
                VER OFERTAS
              </LocalizedClientLink>
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-bounce"></div>
        </div>
      </div>
    </section>
  )
}

export default Hero