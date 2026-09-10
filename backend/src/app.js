import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import carteiraRoutes from "./routes/carteiraRoutes.js";
import transacaoRoutes from "./routes/transacaoRoutes.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import { errorHandler } from "./middlewares/errorMiddleware.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "100kb" }));
app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.get("/api-docs/openapi.json", (_req, res) => res.json({ openapi: "3.0.3", info: { title: "Carteira Digital API", version: "1.0.0" }, paths: {
  "/api/auth/cadastro": { post: { summary: "Cria usuário e conta", responses: { 201: { description: "Criado" }, 400: { description: "Dados inválidos" }, 409: { description: "E-mail duplicado" } } } },
  "/api/auth/login": { post: { summary: "Autentica usuário", responses: { 200: { description: "Sessão criada" }, 401: { description: "Credenciais inválidas" } } } },
  "/api/carteiras/minha": { get: { summary: "Consulta saldo", responses: { 200: { description: "Conta" }, 401: { description: "Não autenticado" } } } },
  "/api/carteiras/minha/deposito": { post: { summary: "Adiciona crédito de demonstração", responses: { 201: { description: "Saldo atualizado" } } } },
  "/api/transacoes/minhas": { get: { summary: "Lista extrato", responses: { 200: { description: "Transações" } } } },
  "/api/transacoes": { post: { summary: "Realiza transferência", responses: { 201: { description: "Transferência criada" }, 400: { description: "Saldo ou dados inválidos" } } } },
  "/api/usuarios/me": { get: { summary: "Consulta perfil", responses: { 200: { description: "Perfil" } } }, put: { summary: "Edita perfil", responses: { 200: { description: "Perfil atualizado" } } }, delete: { summary: "Exclui conta", responses: { 200: { description: "Conta excluída" } } } }
} }));
app.get("/api-docs", (_req, res) => res.type("html").send(`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Carteira Digital API</title><link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css"></head><body><div id="swagger-ui"></div><script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script><script>SwaggerUIBundle({url:'/api-docs/openapi.json',dom_id:'#swagger-ui'});</script></body></html>`));
app.use("/api/auth", authRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/carteiras", carteiraRoutes);
app.use("/api/transacoes", transacaoRoutes);
app.use((_req, res) => res.status(404).json({ erro: "Rota nao encontrada." }));
app.use(errorHandler);

const port = Number(process.env.PORT || 3000);
if (process.env.NODE_ENV !== "test") app.listen(port, () => console.log(`API em http://localhost:${port}`));
export default app;
