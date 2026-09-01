import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { criarCarteiraVazia } from "../utils/carteiraStorage";

function Cadastro() {
  const navigate = useNavigate();
  const [dados, setDados] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  });
  const [erro, setErro] = useState("");

  function atualizarCampo(event) {
    const { name, value } = event.target;
    setDados((dadosAtuais) => ({ ...dadosAtuais, [name]: value }));
  }

  function cadastrar(event) {
    event.preventDefault();
    setErro("");

    const nome = dados.nome.trim();
    const email = dados.email.trim().toLowerCase();

    if (!nome || !email || !dados.senha || !dados.confirmarSenha) {
      setErro("Preencha todos os campos.");
      return;
    }

    if (dados.senha !== dados.confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
    const emailJaCadastrado = usuarios.some((usuario) => usuario.email === email);

    if (emailJaCadastrado) {
      setErro("Este e-mail já está cadastrado.");
      return;
    }

    localStorage.setItem(
      "usuarios",
      JSON.stringify([
        ...usuarios,
        { nome, email, senha: dados.senha, carteira: criarCarteiraVazia() },
      ]),
    );

    navigate("/login", {
      state: { mensagem: "Cadastro realizado com sucesso. Faça seu login." },
    });
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Carteira Digital</h1>
        <h2>Criar conta</h2>

        <form onSubmit={cadastrar}>
          <label htmlFor="cadastro-nome">Nome</label>
          <input id="cadastro-nome" name="nome" type="text" placeholder="Digite seu nome" value={dados.nome} onChange={atualizarCampo} required />

          <label htmlFor="cadastro-email">E-mail</label>
          <input id="cadastro-email" name="email" type="email" placeholder="Digite seu e-mail" value={dados.email} onChange={atualizarCampo} required />

          <label htmlFor="cadastro-senha">Senha</label>
          <input id="cadastro-senha" name="senha" type="password" placeholder="Digite sua senha" value={dados.senha} onChange={atualizarCampo} required />

          <label htmlFor="cadastro-confirmar-senha">Confirmar senha</label>
          <input id="cadastro-confirmar-senha" name="confirmarSenha" type="password" placeholder="Confirme sua senha" value={dados.confirmarSenha} onChange={atualizarCampo} required />

          <button type="submit">Cadastrar</button>
        </form>

        {erro && <p className="form-message form-message--error">{erro}</p>}

        <p>
          Já possui uma conta?
          <Link to="/login"> Entrar</Link>
        </p>
      </div>
    </div>
  );
}

export default Cadastro;
