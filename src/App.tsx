import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { UsersPage } from './pages/UsersPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { PurchasesPage } from './pages/PurchasesPage';
import { DashboardPage } from './pages/DashboardPage';

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex min-h-screen">
        <aside className="w-64 bg-slate-900/80 border-r border-slate-800 p-6 flex flex-col justify-between hidden md:flex">
          <div>
            <div className="flex items-center gap-3 mb-10">
              <div className="p-2 bg-gradient-to-tr from-cyan-500 to-pink-500 rounded-xl font-bold text-white">🏠</div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">HogarGastos</h1>
            </div>
            <nav className="space-y-2">
              <NavLink to="/" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl font-medium ${isActive ? 'bg-slate-800/60 text-cyan-400 border border-cyan-500/20' : 'text-slate-400 hover:bg-slate-800/40'}`}>
                📊 Dashboard
              </NavLink>
              <NavLink to="/purchases" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl font-medium ${isActive ? 'bg-slate-800/60 text-cyan-400 border border-cyan-500/20' : 'text-slate-400 hover:bg-slate-800/40'}`}>
                🛒 Compras
              </NavLink>
              <NavLink to="/users" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl font-medium ${isActive ? 'bg-slate-800/60 text-cyan-400 border border-cyan-500/20' : 'text-slate-400 hover:bg-slate-800/40'}`}>
                👥 Usuarios
              </NavLink>
              <NavLink to="/categories" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl font-medium ${isActive ? 'bg-slate-800/60 text-cyan-400 border border-cyan-500/20' : 'text-slate-400 hover:bg-slate-800/40'}`}>
                🏷️ Categorías
              </NavLink>
            </nav>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/purchases" element={<PurchasesPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
