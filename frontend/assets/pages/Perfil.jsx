import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { obterUsuarioLogado } from "../utils/carteiraStorage";

function Perfil() {
  const { nome, email } = obterUsuarioLogado();

  return (
    <>
      <Header />

      <div className="page-layout">
        <Sidebar />

        <main className="page-content">
          <h1>Meu Perfil</h1>

          <div className="perfil-card">
            <div className="avatar">
              👤
            </div>

            <h2>{nome}</h2>

            <p>{email}</p>

            <button>Editar perfil</button>
          </div>
        </main>
      </div>
    </>
  );
}

export default Perfil;
