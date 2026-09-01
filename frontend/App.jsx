import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./assets/pages/Home";
import Carteira from "./assets/pages/Carteira";
import Transferir from "./assets/pages/Transferir";
import Transsacoes from "./assets/pages/Transsacoes";
import Perfil from "./assets/pages/Perfil";
import Login from "./assets/pages/Login";
import Cadastro from "./assets/pages/Cadastro";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/carteira" element={<Carteira />} />
        <Route path="/transferir" element={<Transferir />} />
        <Route path="/transacoes" element={<Transsacoes />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="*" element={<h1>Página não encontrada</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
