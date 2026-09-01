import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { realizarTransferencia } from "../utils/carteiraStorage";

function Transferir() {
  const navigate = useNavigate();
  const [dados, setDados] = useState({ destinatario: "", valor: "", descricao: "" });
  const [erro, setErro] = useState("");

  function atualizarCampo(event) {
    const { name, value } = event.target;
    setDados((dadosAtuais) => ({ ...dadosAtuais, [name]: value }));
  }

  function transferir(event) {
    event.preventDefault();
    const resultado = realizarTransferencia({
      destinatario: dados.destinatario.trim().toLowerCase(),
      valor: Number(dados.valor),
      descricao: dados.descricao.trim(),
    });

    if (resultado.erro) {
      setErro(resultado.erro);
      return;
    }

    navigate("/", { state: { mensagem: "Transferência realizada com sucesso." } });
  }

  return (
    <>
      <Header />

      <div className="page-layout">
        <Sidebar />

        <main className="page-content">
          <h1>Transferir dinheiro</h1>

          <div className="form-card">
            <form onSubmit={transferir}>
              <label htmlFor="destinatario">Destinatário</label>
              <input id="destinatario" name="destinatario" type="email" placeholder="E-mail do destinatário" value={dados.destinatario} onChange={atualizarCampo} required />

              <label htmlFor="valor">Valor</label>
              <input id="valor" name="valor" type="number" placeholder="R$ 0,00" value={dados.valor} onChange={atualizarCampo} min="0.01" step="0.01" required />

              <label htmlFor="descricao">Descrição</label>
              <input id="descricao" name="descricao" type="text" placeholder="Descrição da transferência" value={dados.descricao} onChange={atualizarCampo} />

              <button type="submit">Transferir</button>
            </form>
            {erro && <p className="form-message form-message--error">{erro}</p>}
          </div>
        </main>
      </div>
    </>
  );
}

export default Transferir;
