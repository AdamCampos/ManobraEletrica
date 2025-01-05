import fs from "fs";
import path from "path";

const httpsOptions = {
  key: fs.readFileSync(
    path.resolve("C:\\Projetos\\Netbeans\\Java\\Controllogix\\controllogix-react\\ssl\\server.key")
  ),
  cert: fs.readFileSync(
    path.resolve("C:\\Projetos\\Netbeans\\Java\\Controllogix\\controllogix-react\\ssl\\server.crt")
  ),
};

export default httpsOptions;
