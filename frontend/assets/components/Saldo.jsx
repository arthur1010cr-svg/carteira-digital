import { formatarMoeda } from "../utils/carteiraStorage";

function Saldo({ saldo = 0 }) {
  return (
    <div className="saldo-card">
      <span>Saldo disponível</span>

      <h1>{formatarMoeda(saldo)}</h1>

      <p>Saldo atual da sua carteira</p>
    </div>
  );
}

export default Saldo;
