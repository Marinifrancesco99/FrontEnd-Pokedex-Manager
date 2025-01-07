// App.tsx
import React, { useState, useEffect } from "react";
import PokedexHomepage from "./components/organisms/PokedexHomepage";
import Login from "./components/organisms/Login";
import DashboardPage from "./components/organisms/DashboardPage";

const App: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<'home' | 'login' | 'dashboard'>('home');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Controlla se esiste un token al caricamento
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
    }, []);

    const handleNavigate = (page: string) => {
        // Se l'utente prova ad accedere alla dashboard senza autenticazione
        if (page === 'dashboard' && !isAuthenticated) {
            setCurrentPage('login');
            return;
        }

        if (page === 'login' || page === 'home' || page === 'dashboard') {
            setCurrentPage(page as 'home' | 'login' | 'dashboard');
        }
    };

    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
        setCurrentPage('dashboard');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setCurrentPage('home');
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'login':
                return (
                    <Login 
                        onLoginSuccess={handleLoginSuccess} 
                        onNavigate={handleNavigate}
                    />
                );
            case 'dashboard':
                return isAuthenticated ? (
                    <DashboardPage 
                        onNavigate={handleNavigate}
                        onLogout={handleLogout}
                    />
                ) : (
                    <Login 
                        onLoginSuccess={handleLoginSuccess} 
                        onNavigate={handleNavigate}
                    />
                );
            case 'home':
            default:
                return (
                    <PokedexHomepage 
                        onNavigate={handleNavigate}
                    />
                );
        }
    };

    return (
        <div>
            {renderPage()}
        </div>
    );
};

export default App;


