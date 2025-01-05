import express from "express";
import { exec } from "child_process";
import conversionConfig from "../config/conversionConfig.js"; // Importa a configuração centralizada

const router = express.Router();

// Rota para executar a conversão
router.post("/execute-conversion/:type", (req, res) => {
  const fileType = req.params.type;
  const argumento = conversionConfig.argumentos[fileType];

  if (!argumento) {
    return res.status(400).json({ error: "Tipo de arquivo desconhecido para conversão." });
  }

  const command = `"${conversionConfig.appPath}" "${argumento}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: "Erro ao executar conversão.", details: stderr });
    }

    res.json({ message: "Conversão concluída com sucesso!", output: stdout });
  });
});

export default router;
