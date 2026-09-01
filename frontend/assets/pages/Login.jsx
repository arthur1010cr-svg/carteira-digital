import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { criarCarteiraVazia } from "../utils/carteiraStorage";

function Login() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [dados, setDados] = useState({ email: "", senha: "" });
  const [erro, setErro] = useState("");

  function atualizarCampo(event) {
    const { name, value } = event.target;
    setDados((dadosAtuais) => ({ ...dadosAtuais, [name]: value }));
  }

  function entrar(event) {
    event.preventDefault();
    setErro("");

    const email = dados.email.trim().toLowerCase();
    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
    const usuario = usuarios.find(
      (usuarioCadastrado) =>
        usuarioCadastrado.email === email && usuarioCadastrado.senha === dados.senha,
    );

    if (!usuario) {
      setErro("E-mail ou senha inválidos.");
      return;
    }

    localStorage.setItem(
      "usuarioLogado",
      JSON.stringify({
        nome: usuario.nome,
        email: usuario.email,
        carteira: { ...criarCarteiraVazia(), ...usuario.carteira },
      }),
    );
    navigate("/");
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Carteira Digital</h1>
        <h2>Entrar</h2>

        <form onSubmit={entrar}>
          <label htmlFor="login-email">E-mail</label>
          <input id="login-email" name="email" type="email" placeholder="Digite seu e-mail" value={dados.email} onChange={atualizarCampo} required />

          <label htmlFor="login-senha">Senha</label>
          <input id="login-senha" name="senha" type="password" placeholder="Digite sua senha" value={dados.senha} onChange={atualizarCampo} required />

          <button type="submit">Entrar</button>
        </form>

        {state?.mensagem && <p className="form-message form-message--success">{state.mensagem}</p>}
        {erro && <p className="form-message form-message--error">{erro}</p>}

        <p>
          Ainda não possui uma conta?
          <Link to="/cadastro"> Criar conta</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
