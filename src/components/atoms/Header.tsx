// Header Component (components/Header.tsx)
import React from "react";

interface HeaderProps {
    title: string;
    currentPage: string;
    onNavigate: (page: string) => void;
    onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, currentPage, onNavigate, onLogout }) => (
    <header className="bg-gray-800 text-white p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">{title}</h1>
        <nav>
            <ul className="flex space-x-4">
                {currentPage === 'dashboard' ? (
                    <>
                        <li>
                            <button 
                                onClick={() => onNavigate('home')}
                                className="cursor-pointer hover:text-gray-300"
                            >
                                Home
                            </button>
                        </li>
                        <li>
                            <button 
                                onClick={onLogout}
                                className="cursor-pointer hover:text-gray-300"
                            >
                                Logout
                            </button>
                        </li>
                    </>
                ) : (
                    <li>
                        <button 
                            onClick={() => onNavigate(currentPage === 'login' ? 'home' : 'login')}
                            className="cursor-pointer hover:text-gray-300"
                        >
                            {currentPage === 'login' ? 'Home' : 'Login'}
                        </button>
                    </li>
                )}
            </ul>
        </nav>
    </header>
);

export default Header;