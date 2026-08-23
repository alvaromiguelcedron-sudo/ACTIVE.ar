import { supabase } from "./supabase/supabaseClient";

const probarConexion = async () => {
  const { data, error } = await supabase
    .from("productos")
    .select("*");

  if (error) {
    console.error("❌ Error conectando con Supabase:", error);
    return;
  }

  console.log("✅ Supabase conectado correctamente");
  console.log("📦 Productos:", data);
};

probarConexion();