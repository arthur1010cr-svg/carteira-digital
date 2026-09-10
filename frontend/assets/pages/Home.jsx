import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Saldo from "../components/Saldo";
import TransacaoCard from "../components/TransacaoCard";
import { api, obterUsuarioLogado } from "../utils/carteiraStorage";
function Home() {
  const usuario = obterUsuarioLogado(); const [conta, setConta] = useState({ saldo: 0 }); const [transacoes, setTransacoes] = useState([]); const [valor, setValor] = useState(""); const [mostrar, setMostrar] = useState(false); const [mensagem, setMensagem] = useState(""); const [erro, setErro] = useState("");
  const carregar = async () => { try { const [c, t] = await Promise.all([api("/carteiras/minha"), api("/transacoes/minhas")]); setConta(c); setTransacoes(t); } catch (e) { setErro(e.message); } };
  useEffect(() => { carregar(); }, []);
  async function depositar(e) { e.preventDefault(); setErro(""); try { const c = await api("/carteiras/minha/deposito", { method: "POST", body: JSON.stringify({ valor }) }); setConta(c); setValor(""); setMostrar(false); setMensagem(c.mensagem); } catch (err) { setErro(err.message); } }
  return <div className="home"><Header /><div className="home-content"><Sidebar /><main className="dashboard"><h1>Olá, {usuario.nome}!</h1><p>Bem-vindo à sua carteira digital.</p><Saldo saldo={conta.saldo} /><section className="acoes"><Link to="/transferir"><button>Enviar dinheiro</button></Link><button onClick={() => setMostrar(!mostrar)}>Adicionar dinheiro</button></section>{mensagem && <p className="form-message form-message--success">{mensagem}</p>}{erro && <p className="form-message form-message--error">{erro}</p>}{mostrar && <section className="form-card"><h2>Adicionar dinheiro</h2><form onSubmit={depositar}><label>Valor</label><input type="number" min="0.01" step="0.01" value={valor} onChange={(e) => setValor(e.target.value)} required /><button>Confirmar valor</button></form></section>}<section className="ultimas-transacoes"><h2>Últimas transações</h2>{transacoes.length ? transacoes.slice(0, 3).map((t) => <TransacaoCard key={t.id_transacao} tipo={t.tipo} nome={t.contraparte} valor={t.valor} />) : <p>Nenhuma transação realizada ainda.</p>}</section></main></div></div>;
}
export default Home;
