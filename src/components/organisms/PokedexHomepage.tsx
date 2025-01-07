// Main Component (components/PokedexHomepage.tsx)
import React from "react";
import Header from "../atoms/Header";
import Footer from "../atoms/Footer";

interface PokedexHomepageProps {
    onNavigate: (page: string) => void;
}

const PokedexHomepage: React.FC<PokedexHomepageProps> = ({ onNavigate }) => {
    return (
        <div>
            <Header 
                title="Homepage Pokemon" 
                currentPage="home"
                onNavigate={onNavigate}
            />
            <div className="hero min-h-screen bg-orange-500">
                <div className="hero-content flex-col lg:flex-row">
                    <img
                        src="/public/images/pikachu.jpg"
                        alt="Pikachu"
                        className="max-w-sm rounded-lg shadow-2xl size-96"
                    />
                    <div>
                        <h1 className="text-5xl font-bold">BENVENUTO IN POKEDEX BASIC!</h1>
                        <p className="py-6 font-bold">
                            Benvenuti, allenatori, nel nostro Pokédex! Qui troverete tutte le informazioni essenziali sui vostri
                            Pokémon preferiti. Siamo entusiasti di accompagnarvi in questa fantastica avventura nel mondo dei Pokémon,
                            dove ogni cattura è un passo verso la maestria. Preparatevi a esplorare, imparare e diventare i migliori
                            allenatori che ci siano! Buon viaggio e che la vostra squadra sia sempre pronta alla sfida!
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default PokedexHomepage;
