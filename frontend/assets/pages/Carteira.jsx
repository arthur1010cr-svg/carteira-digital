import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Saldo from "../components/Saldo";
import { formatarMoeda, obterUsuarioLogado } from "../utils/carteiraStorage";

function Carteira() {
  const { carteira } = obterUsuarioLogado();
  return (
    <>
      <Header />

      <div className="page-layout">
        <Sidebar />

        <main className="page-content">
          <h1>Minha Carteira</h1>

          <Saldo saldo={carteira.saldo} />

          <div className="carteira-info">
            <h2>Informações da carteira</h2>

            <p>Saldo disponível: {formatarMoeda(carteira.saldo)}</p>

            <p>Entradas: {formatarMoeda(carteira.entradas)}</p>

            <p>Saídas: {formatarMoeda(carteira.saidas)}</p>
          </div>
        </main>
      </div>
    </>
  );
}

export default Carteira;
