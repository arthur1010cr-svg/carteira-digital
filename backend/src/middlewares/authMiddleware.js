import crypto from "crypto";
import { fail } from "./errorMiddleware.js";

const segredo = () => process.env.AUTH_SECRET || "troque-esta-chave-em-producao";
export function criarToken(idUsuario) {
  const payload = Buffer.from(JSON.stringify({ sub: idUsuario, exp: Date.now() + 8 * 60 * 60 * 1000 })).toString("base64url");
  const assinatura = crypto.createHmac("sha256", segredo()).update(payload).digest("base64url");
  return `${payload}.${assinatura}`;
}
export function exigirAutenticacao(req, _res, next) {
  try {
    const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
    if (!token) throw fail("Faça login para continuar.", 401);
    const [payload, assinatura] = token.split(".");
    const esperada = crypto.createHmac("sha256", segredo()).update(payload).digest("base64url");
    if (!payload || !assinatura || !crypto.timingSafeEqual(Buffer.from(assinatura), Buffer.from(esperada))) throw fail("Sessão inválida.", 401);
    const dados = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (!Number.isInteger(dados.sub) || dados.exp < Date.now()) throw fail("Sua sessão expirou. Entre novamente.", 401);
    req.usuarioId = dados.sub;
    next();
  } catch (erro) { next(erro.status ? erro : fail("Sessão inválida.", 401)); }
}
