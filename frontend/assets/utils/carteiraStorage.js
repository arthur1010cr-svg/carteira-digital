export function criarCarteiraVazia() {
  return { saldo: 0, entradas: 0, saidas: 0, transacoes: [] };
}

function lerDados(chave, valorPadrao) {
  try {
    return JSON.parse(localStorage.getItem(chave) || JSON.stringify(valorPadrao));
  } catch {
    return valorPadrao;
  }
}

function normalizarCarteira(carteira) {
  return {
    ...criarCarteiraVazia(),
    ...carteira,
    transacoes: Array.isArray(carteira?.transacoes) ? carteira.transacoes : [],
  };
}

export function obterUsuarioLogado() {
  const usuario = lerDados("usuarioLogado", null);

  return {
    nome: usuario?.nome || "Usuário",
    email: usuario?.email || "",
    carteira: normalizarCarteira(usuario?.carteira),
  };
}

export function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function criarTransacao(tipo, nome, valor, descricao) {
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    tipo,
    nome,
    valor,
    descricao,
    data: new Date().toISOString(),
  };
}

export function adicionarSaldo(valor) {
  const usuarioLogado = obterUsuarioLogado();
  const carteira = normalizarCarteira(usuarioLogado.carteira);
  const novoSaldo = Number((carteira.saldo + valor).toFixed(2));
  const novaCarteira = {
    ...carteira,
    saldo: novoSaldo,
    entradas: Number((carteira.entradas + valor).toFixed(2)),
    transacoes: [criarTransacao("entrada", "Dinheiro adicionado", valor, ""), ...carteira.transacoes],
  };

  atualizarCarteiraDoUsuario(usuarioLogado, novaCarteira);
}

function atualizarCarteiraDoUsuario(usuario, carteira) {
  const usuarioAtualizado = { ...usuario, carteira: normalizarCarteira(carteira) };
  const usuarios = lerDados("usuarios", []);
  const usuariosAtualizados = usuarios.map((item) =>
    item.email === usuario.email ? { ...item, carteira: usuarioAtualizado.carteira } : item,
  );

  localStorage.setItem("usuarios", JSON.stringify(usuariosAtualizados));
  localStorage.setItem("usuarioLogado", JSON.stringify(usuarioAtualizado));
}

export function realizarTransferencia({ destinatario, valor, descricao }) {
  const remetente = obterUsuarioLogado();
  const usuarios = lerDados("usuarios", []);
  const indiceRemetente = usuarios.findIndex((usuario) => usuario.email === remetente.email);
  const indiceDestinatario = usuarios.findIndex((usuario) => usuario.email === destinatario);

  if (indiceRemetente < 0 || indiceDestinatario < 0) {
    return { erro: "Destinatário não encontrado." };
  }
  if (remetente.email === destinatario) {
    return { erro: "Você não pode transferir para a própria conta." };
  }

  const carteiraRemetente = normalizarCarteira(usuarios[indiceRemetente].carteira);
  if (valor <= 0 || !Number.isFinite(valor)) {
    return { erro: "Informe um valor maior que zero." };
  }
  if (valor > carteiraRemetente.saldo) {
    return { erro: "Saldo insuficiente para realizar a transferência." };
  }

  const carteiraDestinatario = normalizarCarteira(usuarios[indiceDestinatario].carteira);
  const nomeDestinatario = usuarios[indiceDestinatario].nome;
  const nomeRemetente = usuarios[indiceRemetente].nome;
  carteiraRemetente.saldo = Number((carteiraRemetente.saldo - valor).toFixed(2));
  carteiraRemetente.saidas = Number((carteiraRemetente.saidas + valor).toFixed(2));
  carteiraRemetente.transacoes = [criarTransacao("saida", `Transferência para ${nomeDestinatario}`, valor, descricao), ...carteiraRemetente.transacoes];
  carteiraDestinatario.saldo = Number((carteiraDestinatario.saldo + valor).toFixed(2));
  carteiraDestinatario.entradas = Number((carteiraDestinatario.entradas + valor).toFixed(2));
  carteiraDestinatario.transacoes = [criarTransacao("entrada", `Transferência de ${nomeRemetente}`, valor, descricao), ...carteiraDestinatario.transacoes];
  usuarios[indiceRemetente] = { ...usuarios[indiceRemetente], carteira: carteiraRemetente };
  usuarios[indiceDestinatario] = { ...usuarios[indiceDestinatario], carteira: carteiraDestinatario };
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  localStorage.setItem("usuarioLogado", JSON.stringify({ ...usuarios[indiceRemetente] }));

  return { sucesso: true };
}
