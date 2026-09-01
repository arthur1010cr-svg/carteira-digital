import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Saldo from "../components/Saldo";
import TransacaoCard from "../components/TransacaoCard";
import { adicionarSaldo, obterUsuarioLogado } from "../utils/carteiraStorage";

function Home() {
  const { state } = useLocation();
  const { nome, carteira } = obterUsuarioLogado();
  const [mostrarAdicionar, setMostrarAdicionar] = useState(false);
  const [valorAdicionar, setValorAdicionar] = useState("");
  const [erroAdicionar, setErroAdicionar] = useState("");
  const [mensagemAdicionar, setMensagemAdicionar] = useState("");

  function adicionarDinheiro(event) {
    event.preventDefault();
    const valor = Number(valorAdicionar);

    if (!Number.isFinite(valor) || valor <= 0) {
      setErroAdicionar("Informe um valor maior que zero.");
      return;
    }

    adicionarSaldo(valor);
    setValorAdicionar("");
    setErroAdicionar("");
    setMensagemAdicionar("Dinheiro adicionado com sucesso.");
    setMostrarAdicionar(false);
  }

  return (
    <div className="home">
      <Header />

      <div className="home-content">
        <Sidebar />

        <main className="dashboard">
          <h1>Olá, {nome}! 👋</h1>
          <p>Bem-vindo à sua carteira digital.</p>

          <Saldo saldo={carteira.saldo} />

          <section className="acoes">
            <Link to="/transferir">
              <button>Enviar dinheiro</button>
            </Link>

            <button type="button" onClick={() => setMostrarAdicionar((mostrar) => !mostrar)}>
              Adicionar dinheiro
            </button>
          </section>

          {state?.mensagem && <p className="form-message form-message--success">{state.mensagem}</p>}
          {mensagemAdicionar && <p className="form-message form-message--success">{mensagemAdicionar}</p>}

          {mostrarAdicionar && (
            <section className="form-card">
              <h2>Adicionar dinheiro</h2>
              <form onSubmit={adicionarDinheiro}>
                <label htmlFor="valor-adicionar">Valor</label>
                <input
                  id="valor-adicionar"
                  name="valorAdicionar"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="R$ 0,00"
                  value={valorAdicionar}
                  onChange={(event) => setValorAdicionar(event.target.value)}
                  required
                />
                <button type="submit">Confirmar valor</button>
              </form>
              {erroAdicionar && <p className="form-message form-message--error">{erroAdicionar}</p>}
            </section>
          )}

          <section className="ultimas-transacoes">
            <h2>Últimas transações</h2>

            {carteira.transacoes.length === 0 ? (
              <p>Nenhuma transação realizada ainda.</p>
            ) : (
              carteira.transacoes.slice(0, 3).map((transacao) => (
                <TransacaoCard key={transacao.id} {...transacao} />
              ))
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default Home;
