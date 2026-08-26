import { useEffect, useRef, useState } from "react";
import { supabase } from "../supabase/supabaseClient";

const Admin = () => {
  // ==========================================
  // ESTADOS DEL FORMULARIO
  // ==========================================

  const [nombre, setNombre] = useState("");
  const [marca, setMarca] = useState("");
  const [precio, setPrecio] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [colores, setColores] = useState("");
  const [talles, setTalles] = useState("");
  const [stock, setStock] = useState("");
  const [genero, setGenero] = useState("");

  // ==========================================
  // IMAGEN
  // ==========================================

  const [imagen, setImagen] = useState(null);
  const [vistaPrevia, setVistaPrevia] = useState("");

  const inputImagenRef = useRef(null);

  // ==========================================
  // PRODUCTOS
  // ==========================================

  const [productos, setProductos] = useState([]);
  const [cargandoProductos, setCargandoProductos] = useState(true);

  // ==========================================
  // EDICIÓN
  // ==========================================

  const [editandoId, setEditandoId] = useState(null);

  // ==========================================
  // SELECCIONAR IMAGEN
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
      console.error("ERROR OBTENIENDO PRODUCTOS:", error);

      setProductos([]);
      setCargandoProductos(false);

      return;
    }

    console.log("PRODUCTOS DESDE SUPABASE:", data);

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
    setCategoria("");
    setDescripcion("");
    setColores("");
    setTalles("");
    setStock("");
    setGenero("");

    setImagen(null);
    setVistaPrevia("");

    setEditandoId(null);

    if (inputImagenRef.current) {
      inputImagenRef.current.value = "";
    }
  };

  // ==========================================
  // EDITAR PRODUCTO
  // ==========================================

  const editarProducto = (producto) => {
    console.log("EDITANDO PRODUCTO:", producto);

    setNombre(producto.nombre || "");
    setMarca(producto.marca || "");
    setPrecio(producto.precio || "");

    // COLUMNA REAL: categoria
    setCategoria(producto.categoria || "");

    // COLUMNA REAL: descripcion
    setDescripcion(producto.descripcion || "");

    // COLUMNA REAL: colores
    setColores(
      Array.isArray(producto.colores)
        ? producto.colores.join(", ")
        : producto.colores || ""
    );

    // COLUMNA REAL: talles
    setTalles(
      Array.isArray(producto.talles)
        ? producto.talles.join(", ")
        : producto.talles || ""
    );

    // COLUMNA REAL: stock
    setStock(producto.stock ?? "");

    // COLUMNA REAL: genero
    setGenero(producto.genero || "");

    // Imagen actual
    setVistaPrevia(producto.imagen_url || "");

    // No hay imagen nueva todavía
    setImagen(null);

    // Guardamos ID
    setEditandoId(producto.id);

    // Subimos al formulario
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
      console.error("ERROR ELIMINANDO PRODUCTO:", error);

      alert("No se pudo eliminar el producto.");

      return;
    }

    alert("Producto eliminado correctamente.");

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
      !nombre.trim() ||
      !marca.trim() ||
      !precio ||
      !categoria.trim() ||
      !descripcion.trim() ||
      !colores.trim() ||
      !stock
    ) {
      alert("Completá todos los campos obligatorios.");

      return;
    }

    // Si es producto nuevo, necesita imagen
    if (!editandoId && !imagen) {
      alert("Seleccioná una imagen para el producto.");

      return;
    }

    try {
      // ========================================
      // COLORES → ARRAY
      // ========================================

      const coloresArray = colores
        .split(",")
        .map((color) => color.trim())
        .filter((color) => color !== "");

      // ========================================
      // TALLES → ARRAY
      // ========================================

      const tallesArray = talles
        .split(",")
        .map((talle) => talle.trim())
        .filter((talle) => talle !== "");

      // ========================================
      // SI ESTAMOS EDITANDO
      // ========================================

      if (editandoId) {
        let imagenUrlActual = null;

        // Buscar producto actual
        const productoActual = productos.find(
          (producto) => producto.id === editandoId
        );

        imagenUrlActual = productoActual?.imagen_url || null;

        // ========================================
        // SI HAY IMAGEN NUEVA
        // ========================================

        if (imagen) {
          const nombreArchivo =
            `${Date.now()}-${imagen.name}`;

          console.log(
            "SUBIENDO NUEVA IMAGEN:",
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
              "ERROR AL SUBIR NUEVA IMAGEN:",
              errorImagen
            );

            alert(
              "Hubo un error al subir la nueva imagen."
            );

            return;
          }

          const { data: datosImagen } =
            supabase.storage
              .from("productos")
              .getPublicUrl(nombreArchivo);

          imagenUrlActual =
            datosImagen.publicUrl;

          console.log(
            "NUEVA URL DE IMAGEN:",
            imagenUrlActual
          );
        }

        // ========================================
        // ACTUALIZAR PRODUCTO
        // ========================================

        const { error } = await supabase
          .from("productos")
          .update({
            nombre: nombre.trim(),
            marca: marca.trim(),
            precio: Number(precio),

            // COLUMNA REAL
            categoria: categoria.trim(),

            // COLUMNA REAL
            descripcion: descripcion.trim(),

            // COLUMNA REAL
            colores: coloresArray,

            // COLUMNA REAL
            talles: tallesArray,

            // COLUMNA REAL
            stock: Number(stock),

            // COLUMNA REAL
            genero: genero || null,

            // COLUMNA REAL
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

        limpiarFormulario();

        obtenerProductos();

        return;
      }

      // ==========================================
      // CREAR PRODUCTO NUEVO
      // ==========================================

      // ========================================
      // 1. NOMBRE ÚNICO PARA LA IMAGEN
      // ========================================

      const nombreArchivo =
        `${Date.now()}-${imagen.name}`;

      console.log(
        "SUBIENDO IMAGEN:",
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
          "ERROR AL SUBIR IMAGEN:",
          errorImagen
        );

        alert(
          "Hubo un error al subir la imagen."
        );

        return;
      }

      console.log(
        "IMAGEN SUBIDA CORRECTAMENTE"
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
        "URL DE LA IMAGEN:",
        imagenUrl
      );

      // ========================================
      // 4. GUARDAR PRODUCTO
      // ========================================

      console.log(
        "PRODUCTO QUE SE VA A GUARDAR:",
        {
          nombre: nombre.trim(),
          marca: marca.trim(),
          precio: Number(precio),
          categoria: categoria.trim(),
          descripcion: descripcion.trim(),
          colores: coloresArray,
          talles: tallesArray,
          stock: Number(stock),
          genero: genero || null,
          imagen_url: imagenUrl,
        }
      );

      const { data, error } =
        await supabase
          .from("productos")
          .insert([
            {
              nombre: nombre.trim(),
              marca: marca.trim(),
              precio: Number(precio),

              // COLUMNA REAL
              categoria: categoria.trim(),

              // COLUMNA REAL
              descripcion: descripcion.trim(),

              // COLUMNA REAL
              colores: coloresArray,

              // COLUMNA REAL
              talles: tallesArray,

              // COLUMNA REAL
              stock: Number(stock),

              // COLUMNA REAL
              genero: genero || null,

              // COLUMNA REAL
              imagen_url: imagenUrl,
            },
          ])
          .select();

      // ========================================
      // 5. ERROR
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
        "PRODUCTO GUARDADO CORRECTAMENTE:",
        data
      );

      alert(
        "¡Producto guardado correctamente!"
      );

      // ========================================
      // 7. LIMPIAR
      // ========================================

      limpiarFormulario();

      // ========================================
      // 8. RECARGAR PRODUCTOS
      // ========================================

      obtenerProductos();

    } catch (error) {
      console.error(
        "ERROR INESPERADO:",
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
            Gestioná los productos de ACTIVE.ar
          </p>

        </div>

        {/* ======================================
            FORMULARIO
        ====================================== */}

        <form
          onSubmit={guardarProducto}
          className="bg-white p-6 rounded-xl shadow-md space-y-5"
        >

          <h2 className="text-2xl font-bold text-gray-900">
            {editandoId
              ? "Editar producto"
              : "Agregar nuevo producto"}
          </h2>

          {/* MENSAJE EDICIÓN */}

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
              placeholder="Ej: Buso deportivo"
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
              placeholder="Ej: Puma"
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
              value={categoria}
              onChange={(e) =>
                setCategoria(e.target.value)
              }
              placeholder="Ej: ropa"
              className="w-full border rounded-lg px-3 py-2"
            />

          </div>

          {/* ======================================
              GÉNERO
          ====================================== */}

          <div>

            <label className="block font-medium mb-1">
              Género
            </label>

            <select
              value={genero}
              onChange={(e) =>
                setGenero(e.target.value)
              }
              className="w-full border rounded-lg px-3 py-2"
            >

              <option value="">
                Seleccioná un género
              </option>

              <option value="hombre">
                Hombre
              </option>

              <option value="mujer">
                Mujer
              </option>

              <option value="unisex">
                Unisex
              </option>

            </select>

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
              placeholder="Ej: Negro, Gris, Azul"
              className="w-full border rounded-lg px-3 py-2"
            />

            <p className="text-sm text-gray-500 mt-1">
              Separá los colores con comas.
            </p>

          </div>

          {/* ======================================
              TALLES
          ====================================== */}

          <div>

            <label className="block font-medium mb-1">
              Talles
            </label>

            <input
              type="text"
              value={talles}
              onChange={(e) =>
                setTalles(e.target.value)
              }
              placeholder="Ej: S, M, L, XL"
              className="w-full border rounded-lg px-3 py-2"
            />

            <p className="text-sm text-gray-500 mt-1">
              Separá los talles con comas.
            </p>

          </div>

          {/* ======================================
              STOCK
          ====================================== */}

          <div>

            <label className="block font-medium mb-1">
              Stock
            </label>

            <input
              type="number"
              value={stock}
              onChange={(e) =>
                setStock(e.target.value)
              }
              placeholder="Ej: 10"
              min="0"
              className="w-full border rounded-lg px-3 py-2"
            />

          </div>

          {/* ======================================
              BOTONES
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
            PRODUCTOS CARGADOS
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

          {/* CARGANDO */}

          {cargandoProductos && (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">

              <p className="text-gray-600">
                Cargando productos...
              </p>

            </div>
          )}

          {/* SIN PRODUCTOS */}

          {!cargandoProductos &&
            productos.length === 0 && (

              <div className="bg-white rounded-xl shadow-md p-8 text-center">

                <p className="text-gray-600">
                  No hay productos cargados.
                </p>

              </div>

            )}

          {/* LISTA */}

          {!cargandoProductos &&
            productos.length > 0 && (

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                {productos.map((producto) => (

                  <article
                    key={producto.id}
                    className="bg-white rounded-xl shadow-md overflow-hidden"
                  >

                    {/* IMAGEN */}

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

                      ) : (

                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          Sin imagen
                        </div>

                      )}

                    </div>

                    {/* INFORMACIÓN */}

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
                        Categoría: {producto.categoria}
                      </p>

                      <p className="text-gray-600 mt-1">
                        Stock: {producto.stock}
                      </p>

                      {producto.genero && (
                        <p className="text-gray-600 mt-1">
                          Género: {producto.genero}
                        </p>
                      )}

                      {/* EDITAR */}

                      <button
                        type="button"
                        onClick={() =>
                          editarProducto(producto)
                        }
                        className="w-full mt-4 bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-800 transition"
                      >
                        Editar producto
                      </button>

                      {/* ELIMINAR */}

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