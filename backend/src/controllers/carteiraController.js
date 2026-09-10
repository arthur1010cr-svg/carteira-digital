import { fail } from "../middlewares/errorMiddleware.js";
import { adicionarSaldo, buscarPorUsuario } from "../models/contaModel.js";
import { valorMonetarioValido } from "../services/validationService.js";

export async function obterMinhaConta(req, res) {
  const conta = await buscarPorUsuario(req.usuarioId);
  if (!conta) throw fail("Conta não encontrada.", 404);
  res.json(conta);
}
// Crédito de demonstração para a carteira; transferências são registradas em transacoes.
export async function depositar(req, res) {
  const valor = Number(req.body.valor);
  if (!valorMonetarioValido(valor)) throw fail("Informe um valor válido.");
  const conta = await adicionarSaldo(req.usuarioId, valor);
  res.status(201).json({ mensagem: "Saldo adicionado com sucesso.", ...conta });
}
