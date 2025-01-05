const routesDocumentation = [
    {
      method: "GET",
      route: "/list-files/:type",
      description: "Lista arquivos de um determinado tipo.",
      params: {
        type: "O tipo de arquivo (ex.: l5x, csv, sql).",
      },
      responses: {
        200: "Uma lista de arquivos disponíveis.",
        400: "Tipo de arquivo desconhecido.",
        500: "Erro ao listar arquivos.",
      },
    },
    {
      method: "POST",
      route: "/upload/:type",
      description: "Faz upload de arquivos para um diretório específico.",
      params: {
        type: "O tipo de arquivo a ser enviado (ex.: l5x, csv).",
      },
      responses: {
        200: "Arquivos enviados com sucesso.",
        400: "Erro no formato ou tipo do arquivo.",
      },
    },
    {
      method: "POST",
      route: "/execute-conversion/:type",
      description: "Executa a conversão com base no tipo especificado.",
      params: {
        type: "O tipo de conversão (ex.: l5x, csv, sql).",
      },
      responses: {
        200: "Conversão concluída com sucesso.",
        400: "Tipo de conversão desconhecido.",
        500: "Erro ao executar a conversão.",
      },
    },
  ];
  
  export default routesDocumentation;
  