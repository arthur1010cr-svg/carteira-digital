import { Link, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  function sair() {
    localStorage.removeItem("usuarioLogado");
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
