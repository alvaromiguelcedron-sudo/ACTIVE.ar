const Home = () => {
  return (
    <main className="bg-gray-100 min-h-screen">

      {/* Presentación de la tienda */}
      <section className="text-center py-20 px-4">
        <p className="text-blue-900 font-semibold tracking-widest">
          ACTIVEE | MEN'S SPORTSWEAR
        </p>

        <h1 className="text-5xl font-bold text-gray-900 mt-4">
          ACTIVE
        </h1>

        <p className="text-gray-600 mt-4 max-w-xl mx-auto">
          Indumentaria deportiva y urbana para hombre.
        </p>

        <button className="mt-8 bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800">
          Ver productos
        </button>
      </section>

    </main>
  )
}

export default Home