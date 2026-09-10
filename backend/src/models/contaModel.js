import db from "../config/database.js";

export async function buscarPorUsuario(idUsuario) {
  const [contas] = await db.execute("SELECT id_conta, saldo, data_criacao FROM contas WHERE id_usuario = ?", [idUsuario]);
  return contas[0] || null;
}

export async function adicionarSaldo(idUsuario, valor) {
  await db.execute("UPDATE contas SET saldo = saldo + ? WHERE id_usuario = ?", [valor, idUsuario]);
  return buscarPorUsuario(idUsuario);
}
