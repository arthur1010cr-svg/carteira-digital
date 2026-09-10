# Carteira Digital

Aplicação web de carteira digital com React, Node.js/Express e MySQL. Permite cadastro, login, saldo, crédito de demonstração, transferência, extrato e edição ou exclusão de perfil.

## Executar

1. Execute `database/schema.sql` no MySQL.
2. Em `backend`, copie `.env.example` para `.env`, configure o banco e rode `npm install` e `npm run dev`.
3. Em `frontend`, rode `npm install` e `npm run dev`.

O front usa `http://localhost:3000/api`. Para outro endereço, defina `VITE_API_URL` em `frontend/.env`.

## API

Documentação OpenAPI: `http://localhost:3000/api-docs`.

Rotas principais: cadastro/login, saldo, depósito, transferências, extrato e `GET|PUT|DELETE /api/usuarios/me`.

## Banco

O script possui `usuarios`, `contas`, `transacoes` e `logs_acesso`, com constraints, índices, view `vw_extrato`, trigger e procedure. Um usuário possui uma conta; cada transferência tem conta de origem e destino.

Os requisitos, casos de uso, diagrama conceitual e dicionário resumido estão em [docs/requisitos.md](docs/requisitos.md). Os testes básicos são executados com `cd backend && npm test`.
