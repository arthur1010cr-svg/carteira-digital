import crypto from "crypto";
import db from "../config/database.js";
import { fail } from "../middlewares/errorMiddleware.js";
import { corHexValida, emailValido } from "../services/validationService.js";

const usuarioPublico = (u) => ({ id: u.id_usuario, nome: u.nome, email: u.email, corCarteira: u.cor_carteira, dataCriacao: u.data_criacao });
const hashSenha = (senha, sal = crypto.randomBytes(16).toString("hex")) => `${sal}:${crypto.scryptSync(senha, sal, 64).toString("hex")}`;
export async function obterPerfil(req, res) {
  const [usuarios] = await db.execute("SELECT * FROM usuarios WHERE id_usuario=?", [req.usuarioId]);
  if (!usuarios[0]) throw fail("Usuário não encontrado.", 404);
  res.json(usuarioPublico(usuarios[0]));
}
export async function atualizarPerfil(req, res) {
  const nome = req.body.nome?.trim(); const email = req.body.email?.trim().toLowerCase();
  const cor = req.body.corCarteira;
  if (!nome || !email || nome.length > 120 || !emailValido(email)) throw fail("Nome ou e-mail inválido.");
  if (cor !== undefined && !corHexValida(cor)) throw fail("Cor da carteira inválida.");
  const campos = [nome, email, cor || "#2b5c8a"]; let sql = "UPDATE usuarios SET nome=?, email=?, cor_carteira=?";
  if (req.body.senha) { if (req.body.senha.length < 6) throw fail("A senha deve ter pelo menos 6 caracteres."); sql += ", senha_hash=?"; campos.push(hashSenha(req.body.senha)); }
  campos.push(req.usuarioId);
  try { await db.execute(`${sql} WHERE id_usuario=?`, campos); } catch (erro) { if (erro.code === "ER_DUP_ENTRY") throw fail("Este e-mail já está cadastrado.", 409); throw erro; }
  return obterPerfil(req, res);
}
export async function excluirPerfil(req, res) {
  const [transacoes] = await db.execute(`SELECT COUNT(*) total FROM transacoes t
    JOIN contas c ON c.id_conta=t.id_conta_origem OR c.id_conta=t.id_conta_destino
    WHERE c.id_usuario=?`, [req.usuarioId]);
  if (transacoes[0].total > 0) throw fail("Não é possível excluir uma conta que possui transferências registradas.", 409);
  const [resultado] = await db.execute("DELETE FROM usuarios WHERE id_usuario=?", [req.usuarioId]);
  if (!resultado.affectedRows) throw fail("Usuário não encontrado.", 404);
  res.json({ mensagem: "Conta excluída com sucesso." });
}
