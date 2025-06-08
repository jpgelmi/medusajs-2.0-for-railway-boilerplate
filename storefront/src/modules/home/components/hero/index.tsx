"use client"

import { useEffect, useState } from "react"
import { Button, Heading } from "@medusajs/ui"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { ChevronRight, Zap, Shield, Truck } from 'lucide-react'

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  // Slides con diferentes productos destacados
  const slides = [
    {
      image: "/images/runners-1.png",
      title: "CORRE COMO UN",
      highlight: "CAMPEÓN",
      subtitle: "Zapatillas de running profesionales con tecnología de amortiguación avanzada",
      cta: "EXPLORAR RUNNING",
      link: "/categories/zapatillas",
      badge: "NUEVO"
    },
    {
      image: "/images/spikes-hero.jpg", // Asegúrate de tener esta imagen
      title: "VELOCIDAD",
      highlight: "EXPLOSIVA",
      subtitle: "Zapatillas de clavos para pista - Máximo rendimiento en competición",
      cta: "VER CLAVOS",
      link: "/categories/zapatillas-clavos",
      badge: "⚡ ÉLITE"
    },
    {
      image: "/images/training-hero.jpg", // Asegúrate de tener esta imagen
      title: "ENTRENA SIN",
      highlight: "LÍMITES",
      subtitle: "Ropa técnica diseñada para atletas de alto rendimiento",
      cta: "SHOP NOW",
      link: "/store",
      badge: "-30% OFF"
    }
  ]

  // Auto-slide cada 5 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <div className="relative">
      {/* Hero Slider Section */}
      <section className="relative h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden bg-black">
        {/* Slides */}
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Background Image con efecto parallax */}
            <div className="absolute inset-0 scale-105">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover object-center"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="relative h-full flex items-center">
              <div className="container mx-auto px-4 md:px-8 lg:px-12">
                <div className="max-w-3xl">
                  {/* Badge */}
                  <div className="inline-block mb-6">
                    <span className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold tracking-wide animate-pulse">
                      {slide.badge}
                    </span>
                  </div>

                  {/* Title */}
                  <Heading
                    level="h1"
                    className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-4 leading-none text-white"
                  >
                    {slide.title}
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 animate-gradient">
                      {slide.highlight}
                    </span>
                  </Heading>

                  {/* Subtitle */}
                  <p className="text-lg md:text-xl lg:text-2xl mb-8 text-gray-200 font-light max-w-2xl">
                    {slide.subtitle}
                  </p>

                  {/* CTA Button */}
                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    <Button
                      asChild
                      size="large"
                      className="group bg-white text-black hover:bg-gray-100 text-base md:text-lg px-8 md:px-10 py-4 md:py-5 rounded-full font-bold shadow-2xl transform hover:scale-105 transition-all duration-300 border-0"
                    >
                      <LocalizedClientLink href={slide.link}>
                        {slide.cta}
                        <ChevronRight className="inline-block ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </LocalizedClientLink>
                    </Button>
                    
                    <Button
                      asChild
                      size="large"
                      variant="secondary"
                      className="border-2 border-white/50 text-white hover:bg-white hover:text-black text-base md:text-lg px-8 md:px-10 py-4 md:py-5 rounded-full font-bold backdrop-blur-md bg-white/10 transform hover:scale-105 transition-all duration-300"
                    >
                      <LocalizedClientLink href="/collections/sale">
                        VER OFERTAS
                      </LocalizedClientLink>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`transition-all duration-300 ${
                index === currentSlide
                  ? 'w-12 h-3 bg-white rounded-full'
                  : 'w-3 h-3 bg-white/50 rounded-full hover:bg-white/70'
              }`}
              aria-label={`Ir a slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
          className="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 z-20 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
          aria-label="Slide anterior"
        >
          <ChevronRight className="h-6 w-6 rotate-180" />
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
          className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 z-20 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
          aria-label="Siguiente slide"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </section>

      {/* Features Bar */}
      <div className="bg-gradient-to-r from-gray-900 to-black py-4 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            <div className="flex items-center justify-center gap-3 text-white">
              <Truck className="h-6 w-6 text-yellow-400" />
              <span className="text-sm font-medium">Envío gratis en compras sobre $50.000</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-white">
              <Zap className="h-6 w-6 text-yellow-400" />
              <span className="text-sm font-medium">Tecnología de punta en cada producto</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-white">
              <Shield className="h-6 w-6 text-yellow-400" />
              <span className="text-sm font-medium">Garantía de satisfacción 100%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Categories */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <Heading level="h2" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              COMPRA POR CATEGORÍA
            </Heading>
            <p className="text-gray-600 text-lg">Encuentra el equipamiento perfecto para tu deporte</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {/* Hombres */}
            <LocalizedClientLink
              href="/categories/hombre"
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="aspect-[3/4] relative">
                <Image
                  src="/images/men-category.jpg"
                  alt="Hombres"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white text-2xl font-bold mb-2">HOMBRES</h3>
                  <p className="text-white/80 text-sm">Explorar colección →</p>
                </div>
              </div>
            </LocalizedClientLink>

            {/* Mujeres */}
            <LocalizedClientLink
              href="/categories/mujer"
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="aspect-[3/4] relative">
                <Image
                  src="/images/women-category.jpg"
                  alt="Mujeres"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-pink-900/80 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white text-2xl font-bold mb-2">MUJERES</h3>
                  <p className="text-white/80 text-sm">Explorar colección →</p>
                </div>
              </div>
            </LocalizedClientLink>

            {/* Zapatillas */}
            <LocalizedClientLink
              href="/categories/zapatillas"
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="aspect-[3/4] relative">
                <Image
                  src="/images/shoes-category.jpg"
                  alt="Zapatillas"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white text-2xl font-bold mb-2">ZAPATILLAS</h3>
                  <p className="text-white/80 text-sm">Ver todas →</p>
                </div>
              </div>
            </LocalizedClientLink>

            {/* Clavos */}
            <LocalizedClientLink
              href="/categories/zapatillas-clavos"
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="aspect-[3/4] relative">
                <Image
                  src="/images/spikes-category.jpg"
                  alt="Clavos"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-orange-900/80 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white text-2xl font-bold mb-2">CLAVOS ⚡</h3>
                  <p className="text-white/80 text-sm">Elite performance →</p>
                </div>
              </div>
            </LocalizedClientLink>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Hero