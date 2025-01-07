import React from "react";
import Header from "../atoms/Header";
import Footer from "../atoms/Footer";

interface DashboardPageProps {
    onNavigate: (page: string) => void;
    onLogout: () => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate, onLogout }) => {
    return (
        <div>
            <Header 
                title="Dashboard Pokemon" 
                currentPage="dashboard"
                onNavigate={onNavigate}
                onLogout={onLogout}
            />
            <div className="hero min-h-screen bg-orange-500">
                <div className="hero-content text-center">
                    <h1 className="text-5xl font-bold">Sei entrato</h1>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default DashboardPage; 