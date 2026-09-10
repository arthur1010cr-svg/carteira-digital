export function asyncRoute(controller) {
  return (req, res, next) => Promise.resolve(controller(req, res, next)).catch(next);
}

export function fail(mensagem, status = 400) {
  return Object.assign(new Error(mensagem), { status });
}

export function errorHandler(error, _req, res, _next) {
  const status = error.status || (error.type === "entity.parse.failed" ? 400 : 500);
  if (status >= 500) console.error(error);
  res.status(status).json({ erro: status === 500 ? "Erro interno do servidor." : error.message });
}
