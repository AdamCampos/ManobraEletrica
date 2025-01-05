const logRequests = (req, res, next) => {
    const { method, url } = req;
    const timestamp = new Date().toISOString();
  
    console.log(`[${timestamp}] ${method} ${url}`);
  
    // Captura a resposta após a finalização
    res.on("finish", () => {
      const { statusCode } = res;
      console.log(`[${timestamp}] ${method} ${url} - Status: ${statusCode}`);
    });
  
    next();
  };
  
  export default logRequests;
  