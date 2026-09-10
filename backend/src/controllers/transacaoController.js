import db from "../config/database.js";
import { fail } from "../middlewares/errorMiddleware.js";
import { valorMonetarioValido } from "../services/validationService.js";

export async function listarMinhas(req, res) {
  const [transacoes] = await db.execute(`SELECT t.id_transacao, t.valor, t.data_transacao, t.status,
    CASE WHEN co.id_usuario = ? THEN 'saida' ELSE 'entrada' END tipo,
    CASE WHEN co.id_usuario = ? THEN ud.nome ELSE uo.nome END contraparte
    FROM transacoes t JOIN contas co ON co.id_conta=t.id_conta_origem JOIN contas cd ON cd.id_conta=t.id_conta_destino
    JOIN usuarios uo ON uo.id_usuario=co.id_usuario JOIN usuarios ud ON ud.id_usuario=cd.id_usuario
    WHERE co.id_usuario=? OR cd.id_usuario=? ORDER BY t.data_transacao DESC, t.id_transacao DESC`, [req.usuarioId, req.usuarioId, req.usuarioId, req.usuarioId]);
  res.json(transacoes);
}
export async function buscar(req, res) {
  const [linhas] = await db.execute(`SELECT t.* FROM transacoes t JOIN contas co ON co.id_conta=t.id_conta_origem JOIN contas cd ON cd.id_conta=t.id_conta_destino WHERE t.id_transacao=? AND (co.id_usuario=? OR cd.id_usuario=?)`, [req.params.id, req.usuarioId, req.usuarioId]);
  if (!linhas[0]) throw fail("Transação não encontrada.", 404);
  res.json(linhas[0]);
}
export async function transferir(req, res) {
  const valor = Number(req.body.valor);
  const email = req.body.emailDestinatario?.trim().toLowerCase();
  if (!email || !valorMonetarioValido(valor)) throw fail("Informe destinatário e valor válido.");
  const conexao = await db.getConnection();
  try {
    await conexao.beginTransaction();
    const [contas] = await conexao.execute(`SELECT c.id_conta, c.saldo, u.id_usuario, u.email FROM contas c JOIN usuarios u ON u.id_usuario=c.id_usuario WHERE u.id_usuario=? OR u.email=? ORDER BY c.id_conta FOR UPDATE`, [req.usuarioId, email]);
    const origem = contas.find((c) => c.id_usuario === req.usuarioId);
    const destino = contas.find((c) => c.email === email);
    if (!origem || !destino) throw fail("Destinatário não encontrado.", 404);
    if (origem.id_conta === destino.id_conta) throw fail("Não é permitido transferir para a própria conta.");
    if (origem.saldo < valor) throw fail("Saldo insuficiente.");
    const [registro] = await conexao.execute("INSERT INTO transacoes(id_conta_origem, id_conta_destino, valor) VALUES (?, ?, ?)", [origem.id_conta, destino.id_conta, valor]);
    await conexao.execute("UPDATE contas SET saldo=saldo-? WHERE id_conta=?", [valor, origem.id_conta]);
    await conexao.execute("UPDATE contas SET saldo=saldo+? WHERE id_conta=?", [valor, destino.id_conta]);
    await conexao.commit();
    res.status(201).json({ id_transacao: registro.insertId, valor, status: "concluida" });
  } catch (erro) { await conexao.rollback(); throw erro; } finally { conexao.release(); }
}
export async function cancelar(req, res) {
  const conexao = await db.getConnection();
  try {
    await conexao.beginTransaction();
    const [linhas] = await conexao.execute(`SELECT t.* FROM transacoes t JOIN contas c ON c.id_conta=t.id_conta_origem WHERE t.id_transacao=? AND c.id_usuario=? FOR UPDATE`, [req.params.id, req.usuarioId]);
    const transacao = linhas[0];
    if (!transacao) throw fail("Transação não encontrada.", 404);
    if (transacao.status !== "concluida") throw fail("Esta transação não pode ser cancelada.");
    await conexao.execute("UPDATE contas SET saldo=saldo+? WHERE id_conta=?", [transacao.valor, transacao.id_conta_origem]);
    await conexao.execute("UPDATE contas SET saldo=saldo-? WHERE id_conta=?", [transacao.valor, transacao.id_conta_destino]);
    await conexao.execute("UPDATE transacoes SET status='cancelada' WHERE id_transacao=?", [transacao.id_transacao]);
    await conexao.commit(); res.json({ mensagem: "Transação cancelada." });
  } catch (erro) { await conexao.rollback(); throw erro; } finally { conexao.release(); }
}
