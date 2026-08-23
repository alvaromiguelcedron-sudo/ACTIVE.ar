import { useEffect, useRef, useState } from "react";
import { supabase } from "../supabase/supabaseClient";

const Admin = () => {
  // ==========================================
  // ESTADOS DEL FORMULARIO
  // ==========================================

  const [nombre, setNombre] = useState("");
  const [marca, setMarca] = useState("");
  const [precio, setPrecio] = useState("");
  const [categorias, setCategorias] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [colores, setColores] = useState("");
  const [alturas, setAlturas] = useState("");
  const [existencias, setExistencias] = useState("");

  // ==========================================
  // ESTADO DE IMAGEN
  // ==========================================

  const [imagen, setImagen] = useState(null);
  const [vistaPrevia, setVistaPrevia] = useState("");

  // ==========================================
  // PRODUCTOS
  // ==========================================

  const [productos, setProductos] = useState([]);
  const [cargandoProductos, setCargandoProductos] = useState(true);

  // ==========================================
  // ESTADO DE EDICIÓN
  // ==========================================

  const [editandoId, setEditandoId] = useState(null);

  // Referencia al input de imagen
  const inputImagenRef = useRef(null);

  // ==========================================
  // CUANDO SELECCIONAMOS UNA IMAGEN
  // ==========================================

  const seleccionarImagen = (e) => {
    const archivo = e.target.files[0];

    if (!archivo) {
      return;
    }

    setImagen(archivo);

    const url = URL.createObjectURL(archivo);
    setVistaPrevia(url);
  };

  // ==========================================
  // OBTENER PRODUCTOS
  // ==========================================

  const obtenerProductos = async () => {
    setCargandoProductos(true);

    const { data, error } = await supabase
      .from("productos")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("Error obteniendo productos:", error);

      setProductos([]);
      setCargandoProductos(false);

      return;
    }

    console.log("Productos del administrador:", data);

    setProductos(data || []);
    setCargandoProductos(false);
  };

  // ==========================================
  // CARGAR PRODUCTOS AL ENTRAR
  // ==========================================

  useEffect(() => {
    obtenerProductos();
  }, []);

  // ==========================================
  // LIMPIAR FORMULARIO
  // ==========================================

  const limpiarFormulario = () => {
    setNombre("");
    setMarca("");
    setPrecio("");
    setCategorias("");
    setDescripcion("");
    setColores("");
    setAlturas("");
    setExistencias("");

    setImagen(null);
    setVistaPrevia("");

    setEditandoId(null);

    // Limpiar input de imagen
    if (inputImagenRef.current) {
      inputImagenRef.current.value = "";
    }
  };

  // ==========================================
  // EDITAR PRODUCTO
  // ==========================================

  const editarProducto = (producto) => {
    console.log("Editando producto:", producto);

    // Cargar datos en el formulario
    setNombre(producto.nombre || "");
    setMarca(producto.marca || "");
    setPrecio(producto.precio || "");
    setCategorias(producto.categorias || "");
    setDescripcion(producto.descripcion || "");

    // Convertir arrays nuevamente a texto
    setColores(
      Array.isArray(producto.colores)
        ? producto.colores.join(", ")
        : producto.colores || ""
    );

    setAlturas(
      Array.isArray(producto.alturas)
        ? producto.alturas.join(", ")
        : producto.alturas || ""
    );

    setExistencias(producto.existencias || "");

    // Mostrar imagen actual
    setVistaPrevia(producto.imagen_url || producto.imagen || "");

    // No tenemos una imagen nueva todavía
    setImagen(null);

    // Guardamos qué producto estamos editando
    setEditandoId(producto.id);

    // Subir nuevamente al formulario
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // CANCELAR EDICIÓN
  // ==========================================

  const cancelarEdicion = () => {
    const confirmar = window.confirm(
      "¿Querés cancelar la edición de este producto?"
    );

    if (!confirmar) {
      return;
    }

    limpiarFormulario();
  };

  // ==========================================
  // ELIMINAR PRODUCTO
  // ==========================================

  const eliminarProducto = async (id) => {
    const confirmar = window.confirm(
      "¿Seguro que querés eliminar este producto?"
    );

    if (!confirmar) {
      return;
    }

    const { error } = await supabase
      .from("productos")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(
        "Error eliminando producto:",
        error
      );

      alert("No se pudo eliminar el producto.");

      return;
    }

    alert("Producto eliminado correctamente.");

    // Si justo estábamos editando este producto,
    // limpiamos el formulario
    if (editandoId === id) {
      limpiarFormulario();
    }

    obtenerProductos();
  };

  // ==========================================
  // GUARDAR / ACTUALIZAR PRODUCTO
  // ==========================================

  const guardarProducto = async (e) => {
    e.preventDefault();

    // ==========================================
    // VALIDACIONES
    // ==========================================

    if (
      !nombre ||
      !marca ||
      !precio ||
      !categorias ||
      !descripcion ||
      !colores ||
      !alturas ||
      !existencias
    ) {
      alert("Completá todos los campos.");

      return;
    }

    // Si estamos creando un producto nuevo,
    // obligamos a seleccionar una imagen.
    if (!editandoId && !imagen) {
      alert("Seleccioná una imagen para el producto.");

      return;
    }

    try {
      // ========================================
      // CONVERTIR COLORES EN ARRAY
      // ========================================

      const coloresArray = colores
        .split(",")
        .map((color) => color.trim())
        .filter((color) => color !== "");

      // ========================================
      // CONVERTIR ALTURAS EN ARRAY
      // ========================================

      const alturasArray = alturas
        .split(",")
        .map((altura) => altura.trim())
        .filter((altura) => altura !== "");

      // ========================================
      // SI ESTAMOS EDITANDO
      // ========================================

      if (editandoId) {
        let imagenUrlActual = null;

        // Buscar el producto que estamos editando
        const productoActual = productos.find(
          (producto) => producto.id === editandoId
        );

        imagenUrlActual =
          productoActual?.imagen_url ||
          productoActual?.imagen ||
          null;

        // ========================================
        // SI SELECCIONÓ UNA NUEVA IMAGEN
        // ========================================

        if (imagen) {
          const nombreArchivo =
            `${Date.now()}-${imagen.name}`;

          console.log(
            "Subiendo nueva imagen:",
            nombreArchivo
          );

          const { error: errorImagen } =
            await supabase.storage
              .from("productos")
              .upload(
                nombreArchivo,
                imagen
              );

          if (errorImagen) {
            console.error(
              "Error al subir nueva imagen:",
              errorImagen
            );

            alert(
              "Hubo un error al subir la nueva imagen."
            );

            return;
          }

          // Obtener nueva URL
          const { data: datosImagen } =
            supabase.storage
              .from("productos")
              .getPublicUrl(nombreArchivo);

          imagenUrlActual =
            datosImagen.publicUrl;

          console.log(
            "Nueva URL de imagen:",
            imagenUrlActual
          );
        }

        // ========================================
        // ACTUALIZAR PRODUCTO EN SUPABASE
        // ========================================

        const { error } = await supabase
          .from("productos")
          .update({
            nombre: nombre,
            marca: marca,
            precio: Number(precio),
            categorias: categorias,
            descripcion: descripcion,
            colores: coloresArray,
            alturas: alturasArray,
            existencias: Number(existencias),
            imagen_url: imagenUrlActual,
          })
          .eq("id", editandoId);

        if (error) {
          console.error(
            "ERROR ACTUALIZANDO PRODUCTO:",
            error
          );

          alert(
            "No se pudo actualizar el producto."
          );

          return;
        }

        alert(
          "¡Producto actualizado correctamente!"
        );

        // Limpiar formulario
        limpiarFormulario();

        // Volver a cargar productos
        obtenerProductos();

        return;
      }

      // ==========================================
      // CREAR PRODUCTO NUEVO
      // ==========================================

      // ========================================
      // 1. CREAR NOMBRE ÚNICO PARA LA IMAGEN
      // ========================================

      const nombreArchivo =
        `${Date.now()}-${imagen.name}`;

      console.log(
        "Subiendo imagen:",
        nombreArchivo
      );

      // ========================================
      // 2. SUBIR IMAGEN A STORAGE
      // ========================================

      const { error: errorImagen } =
        await supabase.storage
          .from("productos")
          .upload(
            nombreArchivo,
            imagen
          );

      if (errorImagen) {
        console.error(
          "Error al subir imagen:",
          errorImagen
        );

        alert(
          "Hubo un error al subir la imagen."
        );

        return;
      }

      console.log(
        "Imagen subida correctamente"
      );

      // ========================================
      // 3. OBTENER URL PÚBLICA
      // ========================================

      const { data: datosImagen } =
        supabase.storage
          .from("productos")
          .getPublicUrl(nombreArchivo);

      const imagenUrl =
        datosImagen.publicUrl;

      console.log(
        "URL de la imagen:",
        imagenUrl
      );

      // ========================================
      // 4. GUARDAR PRODUCTO EN LA TABLA
      // ========================================

      const { data, error } =
        await supabase
          .from("productos")
          .insert([
            {
              nombre: nombre,
              marca: marca,
              precio: Number(precio),
              categorias: categorias,
              descripcion: descripcion,
              colores: coloresArray,
              alturas: alturasArray,
              existencias: Number(existencias),
              imagen_url: imagenUrl,
            },
          ])
          .select();

      // ========================================
      // 5. SI HAY ERROR
      // ========================================

      if (error) {
        console.error(
          "ERROR AL GUARDAR PRODUCTO:",
          error
        );

        alert(
          "La imagen se subió, pero hubo un error al guardar el producto."
        );

        return;
      }

      // ========================================
      // 6. PRODUCTO GUARDADO
      // ========================================

      console.log(
        "Producto guardado correctamente:",
        data
      );

      alert(
        "¡Producto guardado correctamente!"
      );

      // ========================================
      // 7. LIMPIAR FORMULARIO
      // ========================================

      limpiarFormulario();

      // ========================================
      // 8. ACTUALIZAR PRODUCTOS
      // ========================================

      obtenerProductos();

    } catch (error) {
      console.error(
        "Error inesperado:",
        error
      );

      alert(
        "Ocurrió un error inesperado."
      );
    }
  };

  // ==========================================
  // INTERFAZ
  // ==========================================

  return (
    <main className="min-h-screen bg-gray-100">

      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* ======================================
            TÍTULO
        ====================================== */}

        <div className="mb-8">

          <h1 className="text-3xl font-bold text-gray-900">
            Administrador
          </h1>

          <p className="text-gray-600 mt-2">
            Gestioná los productos de ACTIVE
          </p>

        </div>


        {/* ======================================
            FORMULARIO
        ====================================== */}

        <form
          onSubmit={guardarProducto}
          className="bg-white p-6 rounded-xl shadow-md space-y-5"
        >

          {/* TÍTULO DEL FORMULARIO */}

          <h2 className="text-2xl font-bold text-gray-900">
            {editandoId
              ? "Editar producto"
              : "Agregar nuevo producto"}
          </h2>


          {/* MENSAJE DE EDICIÓN */}

          {editandoId && (
            <div className="bg-blue-100 text-blue-900 p-4 rounded-lg">

              <p className="font-medium">
                Estás editando un producto.
              </p>

              <p className="text-sm mt-1">
                Modificá los datos que quieras y
                después presioná "Actualizar producto".
              </p>

            </div>
          )}


          {/* ======================================
              IMAGEN
          ====================================== */}

          <div>

            <label className="block font-medium mb-1">
              Imagen del producto
            </label>

            <input
              ref={inputImagenRef}
              type="file"
              accept="image/*"
              onChange={seleccionarImagen}
              className="w-full border rounded-lg px-3 py-2"
            />

            {/* VISTA PREVIA */}

            {vistaPrevia && (

              <div className="mt-4">

                <p className="text-sm text-gray-500 mb-2">
                  {editandoId
                    ? "Imagen actual / nueva imagen:"
                    : "Vista previa:"}
                </p>

                <img
                  src={vistaPrevia}
                  alt="Vista previa del producto"
                  className="w-48 h-48 object-cover rounded-lg border"
                />

              </div>

            )}

          </div>


          {/* ======================================
              NOMBRE
          ====================================== */}

          <div>

            <label className="block font-medium mb-1">
              Nombre del producto
            </label>

            <input
              type="text"
              value={nombre}
              onChange={(e) =>
                setNombre(e.target.value)
              }
              placeholder="Ej: Campera deportiva"
              className="w-full border rounded-lg px-3 py-2"
            />

          </div>


          {/* ======================================
              MARCA
          ====================================== */}

          <div>

            <label className="block font-medium mb-1">
              Marca
            </label>

            <input
              type="text"
              value={marca}
              onChange={(e) =>
                setMarca(e.target.value)
              }
              placeholder="Ej: Adidas"
              className="w-full border rounded-lg px-3 py-2"
            />

          </div>


          {/* ======================================
              PRECIO
          ====================================== */}

          <div>

            <label className="block font-medium mb-1">
              Precio
            </label>

            <input
              type="number"
              value={precio}
              onChange={(e) =>
                setPrecio(e.target.value)
              }
              placeholder="Ej: 40000"
              min="0"
              className="w-full border rounded-lg px-3 py-2"
            />

          </div>


          {/* ======================================
              CATEGORÍA
          ====================================== */}

          <div>

            <label className="block font-medium mb-1">
              Categoría
            </label>

            <input
              type="text"
              value={categorias}
              onChange={(e) =>
                setCategorias(e.target.value)
              }
              placeholder="Ej: Hombre"
              className="w-full border rounded-lg px-3 py-2"
            />

          </div>


          {/* ======================================
              DESCRIPCIÓN
          ====================================== */}

          <div>

            <label className="block font-medium mb-1">
              Descripción
            </label>

            <textarea
              value={descripcion}
              onChange={(e) =>
                setDescripcion(e.target.value)
              }
              placeholder="Descripción del producto"
              rows="4"
              className="w-full border rounded-lg px-3 py-2"
            />

          </div>


          {/* ======================================
              COLORES
          ====================================== */}

          <div>

            <label className="block font-medium mb-1">
              Colores
            </label>

            <input
              type="text"
              value={colores}
              onChange={(e) =>
                setColores(e.target.value)
              }
              placeholder="Ej: Negro, Azul, Blanco"
              className="w-full border rounded-lg px-3 py-2"
            />

            <p className="text-sm text-gray-500 mt-1">
              Separá los colores con comas.
            </p>

          </div>


          {/* ======================================
              ALTURAS / TALLES
          ====================================== */}

          <div>

            <label className="block font-medium mb-1">
              Alturas
            </label>

            <input
              type="text"
              value={alturas}
              onChange={(e) =>
                setAlturas(e.target.value)
              }
              placeholder="Ej: S, M, L, XL"
              className="w-full border rounded-lg px-3 py-2"
            />

            <p className="text-sm text-gray-500 mt-1">
              Separá las alturas con comas.
            </p>

          </div>


          {/* ======================================
              EXISTENCIAS
          ====================================== */}

          <div>

            <label className="block font-medium mb-1">
              Existencias
            </label>

            <input
              type="number"
              value={existencias}
              onChange={(e) =>
                setExistencias(e.target.value)
              }
              placeholder="Ej: 10"
              min="0"
              className="w-full border rounded-lg px-3 py-2"
            />

          </div>


          {/* ======================================
              BOTONES DEL FORMULARIO
          ====================================== */}

          <div className="flex flex-col gap-3">

            <button
              type="submit"
              className="w-full bg-blue-900 text-white py-3 rounded-lg hover:bg-blue-800 transition font-semibold"
            >
              {editandoId
                ? "Actualizar producto"
                : "Guardar producto"}
            </button>


            {/* CANCELAR EDICIÓN */}

            {editandoId && (
              <button
                type="button"
                onClick={cancelarEdicion}
                className="w-full bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition font-semibold"
              >
                Cancelar edición
              </button>
            )}

          </div>

        </form>


        {/* ======================================
            PRODUCTOS EXISTENTES
        ====================================== */}

        <section className="mt-12">

          <div className="mb-6">

            <h2 className="text-2xl font-bold text-gray-900">
              Productos cargados
            </h2>

            <p className="text-gray-600 mt-1">
              Estos son los productos guardados en Supabase.
            </p>

          </div>


          {/* ======================================
              CARGANDO
          ====================================== */}

          {cargandoProductos && (

            <div className="bg-white rounded-xl shadow-md p-8 text-center">

              <p className="text-gray-600">
                Cargando productos...
              </p>

            </div>

          )}


          {/* ======================================
              SIN PRODUCTOS
          ====================================== */}

          {!cargandoProductos &&
            productos.length === 0 && (

              <div className="bg-white rounded-xl shadow-md p-8 text-center">

                <p className="text-gray-600">
                  No hay productos cargados.
                </p>

              </div>

            )}


          {/* ======================================
              LISTA DE PRODUCTOS
          ====================================== */}

          {!cargandoProductos &&
            productos.length > 0 && (

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                {productos.map((producto) => (

                  <article
                    key={producto.id}
                    className="bg-white rounded-xl shadow-md overflow-hidden"
                  >

                    {/* ======================================
                        IMAGEN
                    ====================================== */}

                    <div className="w-full h-64 bg-gray-100 overflow-hidden">

                      {producto.imagen_url ? (

                        <img
                          src={producto.imagen_url}
                          alt={producto.nombre}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.log(
                              "ERROR CARGANDO IMAGEN:",
                              producto.imagen_url
                            );

                            e.currentTarget.style.display =
                              "none";
                          }}
                        />

                      ) : producto.imagen ? (

                        <img
                          src={producto.imagen}
                          alt={producto.nombre}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.log(
                              "ERROR CARGANDO IMAGEN:",
                              producto.imagen
                            );

                            e.currentTarget.style.display =
                              "none";
                          }}
                        />

                      ) : (

                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          Sin imagen
                        </div>

                      )}

                    </div>


                    {/* ======================================
                        INFORMACIÓN
                    ====================================== */}

                    <div className="p-5">

                      <h3 className="text-xl font-bold text-gray-900">
                        {producto.nombre}
                      </h3>

                      <p className="text-gray-500 mt-1">
                        {producto.marca}
                      </p>

                      <p className="text-blue-900 font-bold text-xl mt-3">
                        $
                        {Number(
                          producto.precio
                        ).toLocaleString("es-AR")}
                      </p>

                      <p className="text-gray-600 mt-2">
                        Stock: {producto.existencias}
                      </p>


                      {/* ======================================
                          BOTÓN EDITAR
                      ====================================== */}

                      <button
                        type="button"
                        onClick={() =>
                          editarProducto(producto)
                        }
                        className="w-full mt-4 bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-800 transition"
                      >
                        Editar producto
                      </button>


                      {/* ======================================
                          BOTÓN ELIMINAR
                      ====================================== */}

                      <button
                        type="button"
                        onClick={() =>
                          eliminarProducto(producto.id)
                        }
                        className="w-full mt-3 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                      >
                        Eliminar producto
                      </button>

                    </div>

                  </article>

                ))}

              </div>

            )}

        </section>

      </div>

    </main>
  );
};

export default Admin;