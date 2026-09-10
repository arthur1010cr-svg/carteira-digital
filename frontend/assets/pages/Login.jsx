import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { api, salvarSessao } from "../utils/carteiraStorage";
function Login() {
  const { state } = useLocation(); const navigate = useNavigate(); const [dados, setDados] = useState({ email: "", senha: "" }); const [erro, setErro] = useState(""); const [carregando, setCarregando] = useState(false);
  async function entrar(e) { e.preventDefault(); setErro(""); setCarregando(true); try { salvarSessao(await api("/auth/login", { method: "POST", body: JSON.stringify(dados) })); navigate("/"); } catch (err) { setErro(err.message); } finally { setCarregando(false); } }
  return <div className="auth-container"><div className="auth-card"><h1>Carteira Digital</h1><h2>Entrar</h2><form onSubmit={entrar}><label>E-mail</label><input name="email" type="email" value={dados.email} onChange={(e) => setDados({ ...dados, email: e.target.value })} required /><label>Senha</label><input name="senha" type="password" value={dados.senha} onChange={(e) => setDados({ ...dados, senha: e.target.value })} required /><button disabled={carregando}>{carregando ? "Entrando..." : "Entrar"}</button></form>{state?.mensagem && <p className="form-message form-message--success">{state.mensagem}</p>}{erro && <p className="form-message form-message--error">{erro}</p>}<p>Ainda não possui uma conta?<Link to="/cadastro"> Criar conta</Link></p></div></div>;
}
export default Login;
