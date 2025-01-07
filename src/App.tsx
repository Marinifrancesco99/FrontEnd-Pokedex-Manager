// App.tsx
import { useState, useEffect } from 'react';
import Login from './components/organisms/Login';
import DashboardPage from './components/organisms/DashboardPage';
import PokedexHomepage from './components/organisms/PokedexHomepage';
import PokedexPage from './components/organisms/PokedexPage';
import WishlistPage from './components/organisms/WishlistPage';
import PokemonDetailPage from './components/organisms/PokemonDetailPage';
import Register from './components/organisms/Register';

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

  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return <PokedexHomepage onNavigate={setCurrentPage} />;
      case 'login':
        return <Login onNavigate={setCurrentPage} onLoginSuccess={handleLoginSuccess} />;
      case 'register':
        return <Register onNavigate={setCurrentPage} />;
      case 'dashboard':
        return <DashboardPage onNavigate={handleNavigate} onLogout={handleLogout} />;
      case 'pokedex':
        return <PokedexPage onNavigate={handleNavigate} onLogout={handleLogout} />;
      case 'wishlist':
        return <WishlistPage onNavigate={handleNavigate} onLogout={handleLogout} />;
      case 'detail':
        return (
          <PokemonDetailPage 
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            pokemonId={detailPageState?.pokemonId || 1}
            returnTo={detailPageState?.returnTo || 'home'}
          />
        );
      default:
        return <PokedexHomepage onNavigate={handleNavigate} />;
    }
  };

  return renderContent();
}

export default App;


