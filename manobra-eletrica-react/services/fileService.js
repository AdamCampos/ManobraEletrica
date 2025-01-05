import fs from "fs";
import paths from "../config/paths.js";

export const listFiles = (req, res) => {
  const fileType = req.params.type;
  const directoryPath = paths[fileType];

  if (!directoryPath) {
    return res.status(400).json({ error: "Tipo de arquivo desconhecido." });
  }

  try {
    const files = fs
      .readdirSync(directoryPath)
      .filter((file) => file.toLowerCase().endsWith(`.${fileType}`));
    res.json(files);
  } catch (error) {
    console.error("Erro ao listar arquivos:", error);
    res.status(500).json({ error: "Erro ao listar arquivos." });
  }
};
