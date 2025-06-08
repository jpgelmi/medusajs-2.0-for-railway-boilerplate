import { getCollections } from "@lib/data/collections"

export default async function DebugCollectionsPage() {
  try {
    const collections = await getCollections()
    
    console.log("🎯 All collections:", collections)

    return (
      <div className="content-container py-8">
        <h1 className="text-3xl font-bold mb-6">Debug: Todas las Colecciones</h1>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Colecciones Disponibles:</h2>
          
          {collections && collections.length > 0 ? (
            <div className="grid gap-4">
              {collections.map((collection) => (
                <div key={collection.id} className="p-4 border rounded bg-gray-50">
                  <h3 className="font-semibold">{collection.title}</h3>
                  <p className="text-sm text-gray-600">Handle: {collection.handle}</p>
                  <p className="text-sm text-gray-600">ID: {collection.id}</p>
                  <a 
                    href={`/us/collections/${collection.handle}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Ver colección →
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-yellow-800">No hay colecciones creadas aún.</p>
              <p className="text-sm text-yellow-600 mt-2">
                Ve al admin para crear tu primera colección.
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded">
          <h3 className="font-semibold text-blue-800 mb-2">Para crear la colección "sale":</h3>
          <ol className="text-sm text-blue-700 space-y-1">
            <li>1. Ve a <a href="http://localhost:9000/app/collections" target="_blank" className="underline">Admin → Collections</a></li>
            <li>2. Haz clic en "Create Collection"</li>
            <li>3. Title: "Ofertas", Handle: "sale"</li>
            <li>4. Guarda la colección</li>
          </ol>
        </div>

        {/* Raw data para debugging */}
        <details className="mt-8">
          <summary className="cursor-pointer font-semibold">Ver datos raw (para debugging)</summary>
          <pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto">
            {JSON.stringify(collections, null, 2)}
          </pre>
        </details>
      </div>
    )
  } catch (error) {
    console.error("❌ Error fetching collections:", error)
    
    return (
      <div className="content-container py-8">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Error</h1>
        <p>Error al obtener las colecciones.</p>
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
          <p className="text-red-800 text-sm">
            Error
          </p>
        </div>
      </div>
    )
  }
}