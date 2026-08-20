const Contacto = () => {
  return (
    <main className="min-h-screen bg-gray-100 py-16 px-4">

      <div className="max-w-5xl mx-auto">

        {/* ENCABEZADO */}
        <div className="text-center mb-12">

          <p className="text-blue-900 font-semibold tracking-widest">
            ACTIVE
          </p>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2">
            Contacto
          </h1>

          <p className="text-gray-600 mt-4 max-w-xl mx-auto">
            ¿Tenés alguna consulta sobre nuestros productos?
            Estamos para ayudarte.
          </p>

        </div>

        {/* TARJETAS DE CONTACTO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* WHATSAPP */}
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center hover:shadow-lg transition">

            <div className="text-4xl mb-4">
              📱
            </div>

            <h2 className="text-xl font-bold text-gray-900">
              WhatsApp
            </h2>

            <p className="text-gray-600 mt-2">
              Consultá por nuestros productos.
            </p>

            <a
              href="https://wa.me/543813318394"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-6 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Escribir por WhatsApp
            </a>

          </div>

          {/* INSTAGRAM */}
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center hover:shadow-lg transition">

            <div className="text-4xl mb-4">
              📸
            </div>

            <h2 className="text-xl font-bold text-gray-900">
              Instagram
            </h2>

            <p className="text-gray-600 mt-2">
              Mirá nuestras novedades y productos.
            </p>

            <a
              href="https://www.instagram.com/activee.ar/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-6 bg-blue-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition"
            >
              Ver Instagram
            </a>

          </div>

          {/* UBICACIÓN */}
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center hover:shadow-lg transition">

            <div className="text-4xl mb-4">
              📍
            </div>

            <h2 className="text-xl font-bold text-gray-900">
              Ubicación
            </h2>

            <p className="text-gray-600 mt-2">
              Encontranos y conocé nuestro local.
            </p>

            <a
  href="https://www.google.com/maps/place/Octaviano+Vera,+T4132+Famaill%C3%A1,+Tucum%C3%A1n/@-27.0493304,-65.407726,3a,75y,153.29h,86.24t/data=!3m7!1e1!3m5!1sbJ2ahPA5iJ15kdfQ42lp2g!2e0!6shttps:%2F%2Fstreetviewpixels-pa.clients6.google.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D3.760132359013525%26panoid%3DbJ2ahPA5iJ15kdfQ42lp2g%26yaw%3D153.28961740376997!7i16384!8i8192!4m6!3m5!1s0x9422496f9d3f140f:0x7fd7fcedc171dd84!8m2!3d-27.046526!4d-65.4140527!16s%2Fg%2F11j6y2yjvz?entry=ttu&g_ep=EgoyMDI2MDgxMi4wIKXMDSoASAFQAw%3D%3D"
  target="_blank"
  rel="noopener noreferrer"
  className="inline-block mt-6 bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
>
  Ver ubicación
</a>

          </div>

        </div>

        {/* MENSAJE FINAL */}
        <div className="bg-white rounded-2xl shadow-sm mt-10 p-10 text-center">

          <h2 className="text-2xl font-bold text-gray-900">
            ¿Buscás un producto en particular?
          </h2>

          <p className="text-gray-600 mt-3">
            Escribinos y te ayudamos a encontrarlo.
          </p>

          <a
            href="https://wa.me/543813318394"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-6 bg-blue-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition"
          >
            Contactarnos
          </a>

        </div>

      </div>

    </main>
  );
};

export default Contacto;