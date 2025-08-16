import app from "./app";

const port = process.env.PORT || 3333;

app.listen(port, () => {
  console.log("🚀 Servidor rodando em http://localhost:3333");
  console.log("📄 Swagger em http://localhost:3333/api-docs");
});
