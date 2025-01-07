// App.tsx
import React, { useState, useEffect } from 'react';
import Login from './components/organisms/Login';
import DashboardPage from './components/organisms/DashboardPage';
import PokedexHomepage from './components/organisms/PokedexHomepage';
import PokedexPage from './components/organisms/PokedexPage';
import WishlistPage from './components/organisms/WishlistPage';
import PokemonDetailPage from './components/organisms/PokemonDetailPage';

interface DetailPageState {
  pokemonId: number;
  returnTo: string;
}

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [detailPageState, setDetailPageState] = useState<DetailPageState | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleNavigate = (page: string, pokemonId?: number) => {
    if (!isLoggedIn && (page === 'dashboard' || page === 'pokedex' || page === 'wishlist')) {
      setCurrentPage('login');
      return;
    }

    if (page === 'detail' && pokemonId) {
      setDetailPageState({
        pokemonId,
        returnTo: currentPage
      });
    }

    setCurrentPage(page);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setCurrentPage('home');
    setDetailPageState(null);
  };

  if (currentPage === 'login') {
    return <Login onLoginSuccess={handleLoginSuccess} onNavigate={handleNavigate} />;
  }

  if (currentPage === 'dashboard' && isLoggedIn) {
    return <DashboardPage onNavigate={handleNavigate} onLogout={handleLogout} />;
  }

  if (currentPage === 'pokedex' && isLoggedIn) {
    return <PokedexPage onNavigate={handleNavigate} onLogout={handleLogout} />;
  }

  if (currentPage === 'wishlist' && isLoggedIn) {
    return <WishlistPage onNavigate={handleNavigate} onLogout={handleLogout} />;
  }

  if (currentPage === 'detail' && detailPageState && isLoggedIn) {
    return (
      <PokemonDetailPage 
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        pokemonId={detailPageState.pokemonId}
        returnTo={detailPageState.returnTo}
      />
    );
  }

  return <PokedexHomepage onNavigate={handleNavigate} />;
}

export default App;


