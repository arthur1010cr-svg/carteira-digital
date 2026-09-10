import { Link, useNavigate } from "react-router-dom";
import { encerrarSessao } from "../utils/carteiraStorage";

function Sidebar() {
  const navigate = useNavigate();

  function sair() {
    encerrarSessao();
    navigate("/login");
  }

  return (
    <aside className="sidebar">
      <nav>
        <Link to="/">🏠 Início</Link>
        <Link to="/carteira">💰 Carteira</Link>
        <Link to="/transferir">💸 Transferir</Link>
        <Link to="/transacoes">📋 Transações</Link>
        <Link to="/perfil">👤 Perfil</Link>
        <button type="button" className="sidebar-link" onClick={sair}>🚪 Sair</button>
      </nav>
    </aside>
  );
}

export default Sidebar;
