import { formatarMoeda } from "../utils/carteiraStorage";

function TransacaoCard({ tipo = "entrada", nome = "Exemplo", valor = 0 }) {
  return (
    <div className="transacao-card">
      <div>
        <strong>{nome}</strong>
        <p>{tipo === "entrada" ? "Entrada" : "Saída"}</p>
      </div>

      <strong className={tipo === "entrada" ? "entrada" : "saida"}>
        {tipo === "entrada" ? "+" : "-"} {formatarMoeda(valor)}
      </strong>
    </div>
  );
}

export default TransacaoCard;
