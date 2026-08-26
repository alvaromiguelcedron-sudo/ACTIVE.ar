import { useEffect, useRef, useState } from "react";
import { supabase } from "../supabase/supabaseClient";

const Admin = () => {
  // ==========================================
  // DATOS DEL PRODUCTO
  // ==========================================

  const [nombre, setNombre] = useState("");
  const [marca, setMarca] = useState("");
  const [precio, setPrecio] = useState("");

  // La columna REAL de Supabase es: categoria
  const [categoria, setCategoria] = useState("");

  // La columna REAL de Supabase es: género
  const [genero, setGenero] = useState("");

  // La columna REAL de Supabase es: descripción
  const [descripcion, setDescripcion] = useState("");

  const [colores, setColores] = useState("");

  // La columna REAL de Supabase es: existencias
  const [existencias, setExistencias] = useState("");

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
  // ESTADO
  // ==========================================

  const [guardando, setGuardando] = useState(false);

  // ==========================================
  // SELECCIONAR IMAGEN
  // ==========================================

  const seleccionarImagen = (e) => {
    const archivo = e.target.files[0];

    if (!archivo) {
      return;
    }

    if (!archivo.type.startsWith("image/")) {
      alert("Seleccioná un archivo de imagen válido.");

      e.target.value = "";

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

    console.log("OBTENIENDO PRODUCTOS DESDE SUPABASE...");

    const { data, error } = await supabase
      .from("productos")
      .select("*")
      .order("id", {
        ascending: false,
      });

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
  // CARGAR PRODUCTOS AL ABRIR
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
    setGenero("");

    setDescripcion("");
    setColores("");

    setExistencias("");

    setImagen(null);
    setVistaPrevia("");

    setEditandoId(null);

    if (inputImagenRef.current) {
      inputImagenRef.current.value = "";
    }
  };

  // ==========================================
  // CAMBIAR CATEGORÍA
  // ==========================================

  const cambiarCategoria = (e) => {
    const nuevaCategoria = e.target.value;

    setCategoria(nuevaCategoria);

    // Si es ropa, no necesitamos género
    if (nuevaCategoria === "ropa") {
      setGenero("");
    }

    // Si es gym, deberá seleccionar género
    if (nuevaCategoria === "gym") {
      setGenero("");
    }
  };

  // ==========================================
  // EDITAR PRODUCTO
  // ==========================================

  const editarProducto = (producto) => {
    console.log("PRODUCTO A EDITAR:", producto);

    setNombre(producto.nombre || "");
    setMarca(producto.marca || "");
    setPrecio(producto.precio ?? "");

    // ========================================
    // CATEGORÍA
    // ========================================

    let categoriaActual = producto.categoria || "";

    // Por si algún producto viejo tiene "gimnasia"
    if (
      categoriaActual === "gimnasia" ||
      categoriaActual === "Gym" ||
      categoriaActual === "Gimnasia"
    ) {
      categoriaActual = "gym";
    }

    setCategoria(categoriaActual);

    // ========================================
    // GÉNERO
    // ========================================

    setGenero(producto["género"] || "");

    // ========================================
    // DESCRIPCIÓN
    // ========================================

    setDescripcion(producto["descripción"] || "");

    // ========================================
    // COLORES
    // ========================================

    if (Array.isArray(producto.colores)) {
      setColores(producto.colores.join(", "));
    } else {
      setColores(producto.colores || "");
    }

    // ========================================
    // EXISTENCIAS
    // ========================================

    setExistencias(producto.existencias ?? "");

    // ========================================
    // IMAGEN ACTUAL
    // ========================================

    setVistaPrevia(producto.imagen_url || "");

    setImagen(null);

    // ========================================
    // ID REAL DE SUPABASE
    // ========================================

    setEditandoId(producto.id);

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
      "¿Querés cancelar la edición?"
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

    try {
      console.log("ELIMINANDO PRODUCTO ID:", id);

      // ========================================
      // 1. BUSCAR PRODUCTO
      // ========================================

      const producto = productos.find(
        (item) => item.id === id
      );

      // ========================================
      // 2. ELIMINAR DE LA TABLA
      // ========================================

      const { error } = await supabase
        .from("productos")
        .delete()
        .eq("id", id);

      if (error) {
        console.error(
          "ERROR ELIMINANDO PRODUCTO:",
          error
        );

        alert(
          `No se pudo eliminar el producto.\n\n${error.message}`
        );

        return;
      }

      // ========================================
      // 3. ELIMINAR IMAGEN DEL STORAGE
      // ========================================

      if (producto?.imagen_url) {
        try {
          const url = new URL(
            producto.imagen_url
          );

          const partes =
            url.pathname.split("/");

          const indiceProductos =
            partes.indexOf("productos");

          if (indiceProductos !== -1) {
            const nombreArchivo =
              partes
                .slice(indiceProductos + 1)
                .join("/");

            if (nombreArchivo) {
              const {
                error: errorImagen,
              } = await supabase.storage
                .from("productos")
                .remove([nombreArchivo]);

              if (errorImagen) {
                console.error(
                  "No se pudo eliminar la imagen:",
                  errorImagen
                );
              }
            }
          }
        } catch (errorImagen) {
          console.error(
            "Error procesando imagen:",
            errorImagen
          );
        }
      }

      alert(
        "Producto eliminado correctamente."
      );

      if (editandoId === id) {
        limpiarFormulario();
      }

      await obtenerProductos();
    } catch (error) {
      console.error(
        "ERROR INESPERADO ELIMINANDO:",
        error
      );

      alert(
        `Ocurrió un error.\n\n${error.message}`
      );
    }
  };

  // ==========================================
  // GUARDAR PRODUCTO
  // ==========================================

  const guardarProducto = async (e) => {
    e.preventDefault();

    if (guardando) {
      return;
    }

    // ==========================================
    // VALIDACIONES
    // ==========================================

    if (
      !nombre.trim() ||
      !marca.trim() ||
      !precio ||
      !categoria ||
      !descripcion.trim() ||
      !colores.trim() ||
      existencias === ""
    ) {
      alert(
        "Completá todos los campos."
      );

      return;
    }

    // ==========================================
    // VALIDAR PRECIO
    // ==========================================

    if (Number(precio) < 0) {
      alert(
        "El precio no puede ser negativo."
      );

      return;
    }

    // ==========================================
    // VALIDAR EXISTENCIAS
    // ==========================================

    if (Number(existencias) < 0) {
      alert(
        "Las existencias no pueden ser negativas."
      );

      return;
    }

    // ==========================================
    // GYM NECESITA GÉNERO
    // ==========================================

    if (
      categoria === "gym" &&
      !genero
    ) {
      alert(
        "Seleccioná Hombre o Mujer para el producto de Gym."
      );

      return;
    }

    // ==========================================
    // ROPA NO GUARDA GÉNERO
    // ==========================================

    const generoParaGuardar =
      categoria === "gym"
        ? genero
        : null;

    // ==========================================
    // IMAGEN OBLIGATORIA AL CREAR
    // ==========================================

    if (!editandoId && !imagen) {
      alert(
        "Seleccioná una imagen para el producto."
      );

      return;
    }

    setGuardando(true);

    let imagenSubidaNueva = null;

    try {
      // ========================================
      // COLORES
      // ========================================

      const coloresArray = colores
        .split(",")
        .map((color) => color.trim())
        .filter(
          (color) => color !== ""
        );

      // ========================================
      // EDITAR PRODUCTO
      // ========================================

      if (editandoId) {
        let imagenUrlActual = null;

        // Buscar producto actual
        const productoActual =
          productos.find(
            (producto) =>
              producto.id === editandoId
          );

        imagenUrlActual =
          productoActual?.imagen_url ||
          null;

        // ======================================
        // SI SE SELECCIONÓ UNA IMAGEN NUEVA
        // ======================================

        if (imagen) {
          const nombreArchivo =
            `${Date.now()}-${imagen.name.replace(
              /\s+/g,
              "-"
            )}`;

          console.log(
            "SUBIENDO NUEVA IMAGEN:",
            nombreArchivo
          );

          const {
            error: errorImagen,
          } = await supabase.storage
            .from("productos")
            .upload(
              nombreArchivo,
              imagen,
              {
                cacheControl: "3600",
                upsert: false,
                contentType: imagen.type,
              }
            );

          if (errorImagen) {
            console.error(
              "ERROR SUBIENDO IMAGEN:",
              errorImagen
            );

            alert(
              `Hubo un error al subir la imagen.\n\n${errorImagen.message}`
            );

            setGuardando(false);

            return;
          }

          imagenSubidaNueva =
            nombreArchivo;

          const {
            data: datosImagen,
          } = supabase.storage
            .from("productos")
            .getPublicUrl(
              nombreArchivo
            );

          imagenUrlActual =
            datosImagen.publicUrl;

          console.log(
            "NUEVA URL:",
            imagenUrlActual
          );
        }

        // ======================================
        // ACTUALIZAR PRODUCTO
        // ======================================

        console.log(
          "ACTUALIZANDO PRODUCTO ID:",
          editandoId
        );

        const {
          error,
        } = await supabase
          .from("productos")
          .update({
            nombre: nombre.trim(),

            marca: marca.trim(),

            precio: Number(precio),

            // COLUMNA REAL
            categoria: categoria,

            // COLUMNA REAL
            "género": generoParaGuardar,

            // COLUMNA REAL
            "descripción":
              descripcion.trim(),

            colores: coloresArray,

            existencias:
              Number(existencias),

            imagen_url:
              imagenUrlActual,
          })
          .eq("id", editandoId);

        if (error) {
          console.error(
            "ERROR ACTUALIZANDO PRODUCTO:",
            error
          );

          // Si subimos imagen nueva pero
          // falló la actualización
          if (imagenSubidaNueva) {
            await supabase.storage
              .from("productos")
              .remove([
                imagenSubidaNueva,
              ]);
          }

          alert(
            `No se pudo actualizar el producto.\n\n${error.message}`
          );

          setGuardando(false);

          return;
        }

        console.log(
          "PRODUCTO ACTUALIZADO CORRECTAMENTE"
        );

        alert(
          "¡Producto actualizado correctamente!"
        );

        limpiarFormulario();

        await obtenerProductos();

        setGuardando(false);

        return;
      }

      // ==========================================
      // CREAR PRODUCTO NUEVO
      // ==========================================

      const nombreArchivo =
        `${Date.now()}-${imagen.name.replace(
          /\s+/g,
          "-"
        )}`;

      console.log(
        "SUBIENDO IMAGEN:",
        nombreArchivo
      );

      // ========================================
      // SUBIR IMAGEN
      // ========================================

      const {
        error: errorImagen,
      } = await supabase.storage
        .from("productos")
        .upload(
          nombreArchivo,
          imagen,
          {
            cacheControl: "3600",
            upsert: false,
            contentType: imagen.type,
          }
        );

      if (errorImagen) {
        console.error(
          "ERROR SUBIENDO IMAGEN:",
          errorImagen
        );

        alert(
          `Hubo un error al subir la imagen.\n\n${errorImagen.message}`
        );

        setGuardando(false);

        return;
      }

      imagenSubidaNueva =
        nombreArchivo;

      console.log(
        "IMAGEN SUBIDA CORRECTAMENTE"
      );

      // ========================================
      // OBTENER URL PÚBLICA
      // ========================================

      const {
        data: datosImagen,
      } = supabase.storage
        .from("productos")
        .getPublicUrl(
          nombreArchivo
        );

      const imagenUrl =
        datosImagen.publicUrl;

      console.log(
        "URL DE IMAGEN:",
        imagenUrl
      );

      // ========================================
      // GUARDAR PRODUCTO
      // ========================================

      console.log(
        "PRODUCTO QUE SE VA A GUARDAR:"
      );

      console.log({
        nombre: nombre.trim(),
        marca: marca.trim(),
        precio: Number(precio),
        categoria: categoria,
        genero: generoParaGuardar,
        descripcion: descripcion.trim(),
        colores: coloresArray,
        existencias: Number(existencias),
        imagen_url: imagenUrl,
      });

      const {
        data,
        error,
      } = await supabase
        .from("productos")
        .insert([
          {
            // COLUMNA REAL
            nombre: nombre.trim(),

            // COLUMNA REAL
            marca: marca.trim(),

            // COLUMNA REAL
            precio: Number(precio),

            // COLUMNA REAL
            categoria: categoria,

            // COLUMNA REAL
            "género":
              generoParaGuardar,

            // COLUMNA REAL
            "descripción":
              descripcion.trim(),

            // COLUMNA REAL
            colores:
              coloresArray,

            // COLUMNA REAL
            existencias:
              Number(existencias),

            // COLUMNA REAL
            imagen_url:
              imagenUrl,
          },
        ])
        .select();

      // ========================================
      // ERROR GUARDANDO
      // ========================================

      if (error) {
        console.error(
          "================================"
        );

        console.error(
          "ERROR GUARDANDO PRODUCTO:"
        );

        console.error(error);

        console.error(
          "================================"
        );

        // Si la imagen se subió pero
        // el producto falló, borrar imagen
        if (imagenSubidaNueva) {
          await supabase.storage
            .from("productos")
            .remove([
              imagenSubidaNueva,
            ]);
        }

        alert(
          `No se pudo guardar el producto.\n\n${error.message}`
        );

        setGuardando(false);

        return;
      }

      // ========================================
      // ÉXITO
      // ========================================

      console.log(
        "PRODUCTO GUARDADO CORRECTAMENTE:",
        data
      );

      alert(
        "¡Producto guardado correctamente!"
      );

      limpiarFormulario();

      await obtenerProductos();
    } catch (error) {
      console.error(
        "ERROR INESPERADO:",
        error
      );

      // Si la imagen quedó subida,
      // intentamos eliminarla
      if (imagenSubidaNueva) {
        await supabase.storage
          .from("productos")
          .remove([
            imagenSubidaNueva,
          ]);
      }

      alert(
        `Ocurrió un error inesperado.\n\n${error.message}`
      );
    } finally {
      setGuardando(false);
    }
  };

  // ==========================================
  // INTERFAZ
  // ==========================================

  return (
    <main className="min-h-screen bg-gray-100">

      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* ====================================
            TÍTULO
        ==================================== */}

        <div className="mb-8">

          <h1 className="text-3xl font-bold text-gray-900">
            Administrador
          </h1>

          <p className="text-gray-600 mt-2">
            Gestioná los productos de ACTIVE.ar
          </p>

        </div>

        {/* ====================================
            FORMULARIO
        ==================================== */}

        <form
          onSubmit={guardarProducto}
          className="bg-white p-6 rounded-xl shadow-md space-y-5"
        >

          <h2 className="text-2xl font-bold text-gray-900">

            {editandoId
              ? "Editar producto"
              : "Agregar nuevo producto"}

          </h2>

          {/* ==================================
              CATEGORÍA
          ================================== */}

          <div>

            <label className="block font-medium mb-1">
              ¿Dónde querés cargar el producto?
            </label>

            <select
              value={categoria}
              onChange={cambiarCategoria}
              className="w-full border rounded-lg px-3 py-2 bg-white"
            >

              <option value="">
                Seleccioná una categoría
              </option>

              <option value="ropa">
                Ropa
              </option>

              <option value="gym">
                Gym
              </option>

            </select>

          </div>

          {/* ==================================
              GÉNERO
          ================================== */}

          {categoria === "gym" && (
            <div>

              <label className="block font-medium mb-1">
                ¿Para quién es?
              </label>

              <select
                value={genero}
                onChange={(e) =>
                  setGenero(e.target.value)
                }
                className="w-full border rounded-lg px-3 py-2 bg-white"
              >

                <option value="">
                  Seleccioná género
                </option>

                <option value="hombre">
                  Hombre
                </option>

                <option value="mujer">
                  Mujer
                </option>

              </select>

            </div>
          )}

          {/* ==================================
              IMAGEN
          ================================== */}

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
                  Vista previa:
                </p>

                <img
                  src={vistaPrevia}
                  alt="Vista previa"
                  className="w-48 h-48 object-cover rounded-lg border"
                />

              </div>
            )}

          </div>

          {/* ==================================
              NOMBRE
          ================================== */}

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
              placeholder="Ej: Buso"
              className="w-full border rounded-lg px-3 py-2"
            />

          </div>

          {/* ==================================
              MARCA
          ================================== */}

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

          {/* ==================================
              PRECIO
          ================================== */}

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

          {/* ==================================
              DESCRIPCIÓN
          ================================== */}

          <div>

            <label className="block font-medium mb-1">
              Descripción
            </label>

            <textarea
              value={descripcion}
              onChange={(e) =>
                setDescripcion(
                  e.target.value
                )
              }
              placeholder="Descripción del producto"
              rows="4"
              className="w-full border rounded-lg px-3 py-2"
            />

          </div>

          {/* ==================================
              COLORES
          ================================== */}

          <div>

            <label className="block font-medium mb-1">
              Colores
            </label>

            <input
              type="text"
              value={colores}
              onChange={(e) =>
                setColores(
                  e.target.value
                )
              }
              placeholder="Ej: Negro, Gris, Azul"
              className="w-full border rounded-lg px-3 py-2"
            />

            <p className="text-sm text-gray-500 mt-1">
              Podés escribir cualquier color.
              Separalos con comas.
            </p>

          </div>

          {/* ==================================
              EXISTENCIAS
          ================================== */}

          <div>

            <label className="block font-medium mb-1">
              Existencias
            </label>

            <input
              type="number"
              value={existencias}
              onChange={(e) =>
                setExistencias(
                  e.target.value
                )
              }
              placeholder="Ej: 10"
              min="0"
              className="w-full border rounded-lg px-3 py-2"
            />

          </div>

          {/* ==================================
              BOTONES
          ================================== */}

          <div className="flex flex-col gap-3">

            <button
              type="submit"
              disabled={guardando}
              className={`w-full text-white py-3 rounded-lg font-semibold transition ${
                guardando
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-900 hover:bg-blue-800"
              }`}
            >

              {guardando
                ? "Guardando producto..."
                : editandoId
                ? "Actualizar producto"
                : "Guardar producto"}

            </button>

            {editandoId && (
              <button
                type="button"
                onClick={cancelarEdicion}
                disabled={guardando}
                className="w-full bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition font-semibold"
              >
                Cancelar edición
              </button>
            )}

          </div>

        </form>

        {/* ====================================
            PRODUCTOS CARGADOS
        ==================================== */}

        <section className="mt-12">

          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Productos cargados
          </h2>

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

                {productos.map(
                  (producto) => (

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

                        {/* CATEGORÍA */}

                        <p className="text-gray-600 mt-2">

                          Categoría:{" "}

                          <span className="font-medium capitalize">
                            {producto.categoria ===
                              "gym" ||
                            producto.categoria ===
                              "gimnasia"
                              ? "Gym"
                              : "Ropa"}
                          </span>

                        </p>

                        {/* GÉNERO */}

                        {producto["género"] && (
                          <p className="text-gray-600 mt-1">

                            Género:{" "}

                            <span className="font-medium capitalize">
                              {producto["género"]}
                            </span>

                          </p>
                        )}

                        {/* PRECIO */}

                        <p className="text-blue-900 font-bold text-xl mt-3">

                          $
                          {Number(
                            producto.precio
                          ).toLocaleString(
                            "es-AR"
                          )}

                        </p>

                        {/* STOCK */}

                        <p className="text-gray-600 mt-2">

                          Stock:{" "}

                          {producto.existencias}

                        </p>

                        {/* COLORES */}

                        {Array.isArray(
                          producto.colores
                        ) &&
                          producto.colores.length >
                            0 && (

                            <p className="text-gray-600 mt-1">

                              Colores:{" "}

                              {producto.colores.join(
                                ", "
                              )}

                            </p>

                          )}

                        {/* EDITAR */}

                        <button
                          type="button"
                          onClick={() =>
                            editarProducto(
                              producto
                            )
                          }
                          className="w-full mt-4 bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-800 transition"
                        >
                          Editar producto
                        </button>

                        {/* ELIMINAR */}

                        <button
                          type="button"
                          onClick={() =>
                            eliminarProducto(
                              producto.id
                            )
                          }
                          className="w-full mt-3 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                        >
                          Eliminar producto
                        </button>

                      </div>

                    </article>

                  )
                )}

              </div>

            )}

        </section>

      </div>

    </main>
  );
};

export default Admin;