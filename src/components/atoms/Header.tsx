// Header Component (components/Header.tsx)
import React from "react";

interface HeaderProps {
    title: string;
    currentPage: string;
    onNavigate: (page: string) => void;
    onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, currentPage, onNavigate, onLogout }) => {
    return (
        <div className="navbar bg-base-100">
            <div className="flex-1">
                <span className="text-xl font-bold">{title}</span>
            </div>
            <div className="flex-none gap-2">
                {currentPage === 'home' ? (
                    <div className="flex gap-2">
                        <button 
                            className="btn btn-primary"
                            onClick={() => onNavigate('login')}
                        >
                            Login
                        </button>
                        <button 
                            className="btn btn-secondary"
                            onClick={() => onNavigate('register')}
                        >
                            Registrati
                        </button>
                    </div>
                ) : (
                    <>
                        {currentPage !== 'dashboard' && (
                            <button 
                                className="btn btn-ghost"
                                onClick={() => onNavigate('dashboard')}
                            >
                                Dashboard
                            </button>
                        )}
                        {currentPage !== 'pokedex' && (
                            <button 
                                className="btn btn-ghost"
                                onClick={() => onNavigate('pokedex')}
                            >
                                Pokedex
                            </button>
                        )}
                        {currentPage !== 'wishlist' && (
                            <button 
                                className="btn btn-ghost"
                                onClick={() => onNavigate('wishlist')}
                            >
                                Wishlist
                            </button>
                        )}
                        {onLogout && (
                            <button 
                                className="btn btn-error"
                                onClick={onLogout}
                            >
                                Logout
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Header;
