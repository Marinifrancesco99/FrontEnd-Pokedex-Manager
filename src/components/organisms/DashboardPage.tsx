import React, { useEffect, useState } from "react";
import Header from "../atoms/Header";
import Footer from "../atoms/Footer";

interface Pokemon {
    national_number: number;
    gen: string;
    english_name: string;
    primary_type: string;
    secondary_type: string | null;
    image_url?: string;  // Opzionale perché useremo un fallback
}

const PokemonCard: React.FC<{ pokemon: Pokemon }> = ({ pokemon }) => {
    // Funzione per ottenere il colore del badge in base al tipo
    const getTypeColor = (type: string) => {
        const typeColors: { [key: string]: string } = {
            'Normale': 'badge-neutral',
            'Fuoco': 'badge-error',
            'Acqua': 'badge-info',
            'Elettro': 'badge-warning',
            'Erba': 'badge-success',
            'Ghiaccio': 'badge-info',
            'Lotta': 'badge-error',
            'Veleno': 'badge-secondary',
            'Terra': 'badge-warning',
            'Volante': 'badge-info',
            'Psico': 'badge-secondary',
            'Coleottero': 'badge-success',
            'Roccia': 'badge-neutral',
            'Spettro': 'badge-secondary',
            'Drago': 'badge-error',
            'Buio': 'badge-neutral',
            'Acciaio': 'badge-neutral',
            'Folletto': 'badge-secondary'
        };
        return typeColors[type] || 'badge-neutral';
    };

    const renderTypes = () => {
        const types = [];
        if (pokemon.primary_type) types.push(pokemon.primary_type);
        if (pokemon.secondary_type) types.push(pokemon.secondary_type);

        if (types.length === 0) {
            return <span className="badge badge-neutral badge-lg">Tipo sconosciuto</span>;
        }

        return types.map((type, index) => (
            <span 
                key={`type-${pokemon.national_number}-${type}-${index}`}
                className={`badge ${getTypeColor(type)} badge-lg`}
            >
                {type}
            </span>
        ));
    };

    return (
        <div className="card w-72 bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
            <figure className="px-6 pt-6 h-48 flex items-center justify-center bg-gray-100 rounded-t-xl">
                <img 
                    src={pokemon.image_url || '/images/pikachu.jpg'} 
                    alt={pokemon.english_name}
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/pikachu.jpg';
                    }}
                />
            </figure>
            <div className="card-body items-center text-center p-4">
                <p className="text-xs text-gray-500">#{pokemon.national_number.toString().padStart(3, '0')}</p>
                <h2 className="card-title text-xl font-bold capitalize">{pokemon.english_name}</h2>
                <p className="text-sm text-gray-500 mb-2">Gen {pokemon.gen}</p>
                <div className="flex flex-wrap gap-2 justify-center">
                    {renderTypes()}
                </div>
            </div>
        </div>
    );
};

const DashboardPage: React.FC<{ onNavigate: (page: string) => void; onLogout: () => void }> = ({ onNavigate, onLogout }) => {
    const [pokemons, setPokemons] = useState<Pokemon[]>([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPokemons = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('Token non trovato');
                    return;
                }

                const response = await fetch('/api/v1/protected/pokemons', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.status === 401) {
                    localStorage.removeItem('token');
                    onLogout();
                    return;
                }

                if (response.ok) {
                    const data = await response.json();
                    console.log('Dati ricevuti dal backend:', data);
                    if (Array.isArray(data)) {
                        const validData = data.map(pokemon => {
                            console.log('Pokemon:', pokemon);
                            if (!pokemon.national_number) {
                                console.warn('Pokemon senza ID:', pokemon);
                            }
                            return pokemon;
                        });
                        setPokemons(validData);
                    } else {
                        console.error('I dati non sono un array:', data);
                        setError('Formato dati non valido');
                    }
                } else {
                    const errorData = await response.text();
                    console.error('Errore dal server:', errorData);
                    setError('Errore nel caricamento dei Pokemon');
                }
            } catch (err) {
                console.error('Errore di connessione:', err);
                setError('Errore di connessione al server');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPokemons();
    }, [onLogout]);

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center items-center h-64">
                    <div className="loading loading-spinner loading-lg"></div>
                </div>
            );
        }

        if (error) {
            return (
                <div className="alert alert-error text-center max-w-xl mx-auto">
                    {error}
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
                {pokemons.map((pokemon) => (
                    <PokemonCard 
                        key={`pokemon-card-${pokemon.national_number}`} 
                        pokemon={pokemon} 
                    />
                ))}
            </div>
        );
    };

    return (
        <div>
            <Header 
                title="Dashboard Pokemon" 
                currentPage="dashboard"
                onNavigate={onNavigate}
                onLogout={onLogout}
            />
            <div className="min-h-screen bg-orange-500 p-8">
                {renderContent()}
            </div>
            <Footer />
        </div>
    );
};

export default DashboardPage; 