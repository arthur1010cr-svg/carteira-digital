import { obterUsuarioLogado } from "../utils/carteiraStorage";

function Header() {
  const { nome } = obterUsuarioLogado();

  return (
    <header className="header">
      <div className="logo">
        <h2>Carteira Digital</h2>
      </div>

      <div className="header-user">
        <span>Olá, {nome} 👋</span>
      </div>
    </header>
  );
}

export default Header;
