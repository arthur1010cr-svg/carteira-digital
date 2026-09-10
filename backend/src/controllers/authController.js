import crypto from "crypto";
import db from "../config/database.js";
import { criarToken } from "../middlewares/authMiddleware.js";
import { fail } from "../middlewares/errorMiddleware.js";
import { emailValido } from "../services/validationService.js";

const hashSenha = (senha, sal = crypto.randomBytes(16).toString("hex")) => `${sal}:${crypto.scryptSync(senha, sal, 64).toString("hex")}`;
const confereSenha = (senha, armazenada) => {
  const [sal, hash] = (armazenada || "").split(":");
  if (!sal || !hash) return false;
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(hashSenha(senha, sal).split(":")[1], "hex"));
};
const respostaUsuario = (u) => ({ id: u.id_usuario, nome: u.nome, email: u.email, corCarteira: u.cor_carteira });

export async function cadastro(req, res) {
  const nome = req.body.nome?.trim();
  const email = req.body.email?.trim().toLowerCase();
  const senha = req.body.senha;
  if (!nome || !email || !senha) throw fail("Preencha nome, e-mail e senha.");
  if (nome.length > 120 || !emailValido(email)) throw fail("Dados cadastrais inválidos.");
  if (senha.length < 6) throw fail("A senha deve ter pelo menos 6 caracteres.");
  const conexao = await db.getConnection();
  try {
    await conexao.beginTransaction();
    const [resultado] = await conexao.execute("INSERT INTO usuarios(nome, email, senha_hash) VALUES (?, ?, ?)", [nome, email, hashSenha(senha)]);
    await conexao.execute("INSERT INTO contas(id_usuario) VALUES (?)", [resultado.insertId]);
    await conexao.commit();
    const usuario = { id_usuario: resultado.insertId, nome, email, cor_carteira: "#2b5c8a" };
    res.status(201).json({ usuario: respostaUsuario(usuario), token: criarToken(resultado.insertId) });
  } catch (erro) {
    await conexao.rollback();
    if (erro.code === "ER_DUP_ENTRY") throw fail("Este e-mail já está cadastrado.", 409);
    throw erro;
  } finally { conexao.release(); }
}

export async function login(req, res) {
  const email = req.body.email?.trim().toLowerCase();
  const senha = req.body.senha || "";
  if (!email || !senha) throw fail("Informe e-mail e senha.");
  const [usuarios] = await db.execute("SELECT * FROM usuarios WHERE email = ?", [email]);
  const usuario = usuarios[0];
  if (!usuario || !confereSenha(senha, usuario.senha_hash)) throw fail("E-mail ou senha inválidos.", 401);
  await db.execute("INSERT INTO logs_acesso(id_usuario, ip_origem) VALUES (?, ?)", [usuario.id_usuario, req.ip]);
  res.json({ usuario: respostaUsuario(usuario), token: criarToken(usuario.id_usuario) });
}
