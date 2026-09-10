USE carteira_digital;
-- Senha dos dois usuários de demonstração: senha123
INSERT INTO usuarios (nome, email, senha_hash, cor_carteira) VALUES
('Ana Silva', 'ana@exemplo.com', 'seed-carteira:fad4ef7a30419e3ecb1ef2f69401444d855dd46a404854b5db541eb67c3430a4f3a4a56cb588c6d73502213ab5315487a67a2e913842843b5c0e35adfe62bd52', '#2b5c8a'),
('Bruno Souza', 'bruno@exemplo.com', 'seed-carteira:fad4ef7a30419e3ecb1ef2f69401444d855dd46a404854b5db541eb67c3430a4f3a4a56cb588c6d73502213ab5315487a67a2e913842843b5c0e35adfe62bd52', '#16805a');
INSERT INTO contas (id_usuario, saldo) VALUES (1, 1000.00), (2, 500.00);
