import { supabase } from "./supabase/supabaseClient";

const probarConexion = async () => {
  const { data, error } = await supabase
    .from("productos")
    .select("*");

  if (error) {
    console.error("❌ ERROR DE SUPABASE:", error);
    return;
  }

  console.log("✅ SUPABASE LEE PRODUCTOS CORRECTAMENTE");
  console.log("📦 Productos:", data);
};

probarConexion();