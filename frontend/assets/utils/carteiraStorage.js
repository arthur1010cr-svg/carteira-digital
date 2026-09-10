const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
export function obterSessao() { try { return JSON.parse(localStorage.getItem("sessao") || "null"); } catch { return null; } }
export function salvarSessao(sessao) { localStorage.setItem("sessao", JSON.stringify(sessao)); }
export function encerrarSessao() { localStorage.removeItem("sessao"); }
export function obterUsuarioLogado() { return obterSessao()?.usuario || { nome: "Usuário", email: "" }; }
export function formatarMoeda(valor) { return Number(valor || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); }
export async function api(caminho, opcoes = {}) {
  const sessao = obterSessao();
  const resposta = await fetch(`${API_URL}${caminho}`, { ...opcoes, headers: { "Content-Type": "application/json", ...(sessao?.token ? { Authorization: `Bearer ${sessao.token}` } : {}), ...opcoes.headers } });
  const dados = await resposta.json().catch(() => ({}));
  if (!resposta.ok) { if (resposta.status === 401) encerrarSessao(); throw new Error(dados.erro || "Não foi possível concluir a operação."); }
  return dados;
}
