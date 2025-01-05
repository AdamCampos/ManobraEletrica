import { exec } from "child_process";

const appPath =
  "C:\\Projetos\\VisualStudio\\LeitorControllogix\\Controllogix\\AppLeitorControllogix\\bin\\Release\\net8.0\\win-x86\\publish\\AppLeitorControllogix.exe";

const argumentos = {
  l5x: "ObterBlocosCSV",
  csv: "CriarSQL",
  sql: "ExecutarSQL",
};

// Função para executar a conversão
export const executeConversion = (fileType, callback) => {
  const argumento = argumentos[fileType];

  if (!argumento) {
    callback(new Error("Tipo de arquivo desconhecido para conversão."));
    return;
  }

  const command = `"${appPath}" "${argumento}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, stdout);
    }
  });
};
