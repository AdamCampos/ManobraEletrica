import cors from "cors";

const corsConfig = cors({
  origin: "*", // Permitir todas as origens
  methods: ["GET", "POST", "OPTIONS"], // Métodos permitidos
  allowedHeaders: ["Content-Type", "Authorization"], // Cabeçalhos permitidos
});

export default corsConfig;
