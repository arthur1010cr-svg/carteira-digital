import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import TransacaoCard from "../components/TransacaoCard";
import { obterUsuarioLogado } from "../utils/carteiraStorage";

function Transacoes() {
  const { carteira } = obterUsuarioLogado();

  return (
    <>
      <Header />

      <div className="page-layout">
        <Sidebar />

        <main className="page-content">
          <h1>Minhas Transações</h1>

          <div className="transacoes-lista">
            {carteira.transacoes.length === 0 ? (
              <p>Nenhuma transação realizada ainda.</p>
            ) : (
              carteira.transacoes.map((transacao) => (
                <TransacaoCard key={transacao.id} {...transacao} />
              ))
            )}
          </div>
        </main>
      </div>
    </>
  );
}

export default Transacoes;
