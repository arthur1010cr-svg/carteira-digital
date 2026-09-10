import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../utils/carteiraStorage";
function Cadastro() {
  const navigate = useNavigate(); const [dados, setDados] = useState({ nome: "", email: "", senha: "", confirmarSenha: "" }); const [erro, setErro] = useState(""); const [carregando, setCarregando] = useState(false);
  async function cadastrar(e) { e.preventDefault(); setErro(""); if (dados.senha !== dados.confirmarSenha) return setErro("As senhas não coincidem."); setCarregando(true); try { await api("/auth/cadastro", { method: "POST", body: JSON.stringify(dados) }); navigate("/login", { state: { mensagem: "Cadastro realizado. Faça seu login." } }); } catch (err) { setErro(err.message); } finally { setCarregando(false); } }
  return <div className="auth-container"><div className="auth-card"><h1>Carteira Digital</h1><h2>Criar conta</h2><form onSubmit={cadastrar}><label>Nome</label><input value={dados.nome} onChange={(e) => setDados({ ...dados, nome: e.target.value })} required /><label>E-mail</label><input type="email" value={dados.email} onChange={(e) => setDados({ ...dados, email: e.target.value })} required /><label>Senha</label><input type="password" minLength="6" value={dados.senha} onChange={(e) => setDados({ ...dados, senha: e.target.value })} required /><label>Confirmar senha</label><input type="password" value={dados.confirmarSenha} onChange={(e) => setDados({ ...dados, confirmarSenha: e.target.value })} required /><button disabled={carregando}>{carregando ? "Cadastrando..." : "Cadastrar"}</button></form>{erro && <p className="form-message form-message--error">{erro}</p>}<p>Já possui uma conta?<Link to="/login"> Entrar</Link></p></div></div>;
}
export default Cadastro;
