import React from "react";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { obterSessao } from "./assets/utils/carteiraStorage";

import Home from "./assets/pages/Home";
import Carteira from "./assets/pages/Carteira";
import Transferir from "./assets/pages/Transferir";
import Transsacoes from "./assets/pages/Transsacoes";
import Perfil from "./assets/pages/Perfil";
import Login from "./assets/pages/Login";
import Cadastro from "./assets/pages/Cadastro";

function App() {
  const Protegida = ({ children }) => obterSessao() ? children : <Navigate to="/login" replace />;
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Protegida><Home /></Protegida>} />
        <Route path="/login" element={<Login />} />
        <Route path="/carteira" element={<Protegida><Carteira /></Protegida>} />
        <Route path="/transferir" element={<Protegida><Transferir /></Protegida>} />
        <Route path="/transacoes" element={<Protegida><Transsacoes /></Protegida>} />
        <Route path="/perfil" element={<Protegida><Perfil /></Protegida>} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="*" element={<h1>Página não encontrada</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
