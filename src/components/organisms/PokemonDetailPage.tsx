import React, { useEffect, useState } from "react";
import Header from "../atoms/Header";
import Footer from "../atoms/Footer";

interface Pokemon {
    national_number: number;
    gen: string;
    english_name: string;
    primary_type: string;
    secondary_type: string;
    abilities_0: string;
    abilities_1: string;
    abilities_special: string;
    attack: number;
    defense: number;
    hp: number;
    speed: number;
    height_m: number;
    weight_kg: number;
    description: string;
    classification: string;
    capture_rate: number;
    percent_male: number;
    percent_female: number;
    is_legendary: number;
    is_mythical: number;
    evochain_0: string;
    evochain_2: string;
    evochain_4: string;
}

const PokemonDetailPage: React.FC<{ 
    onNavigate: (page: string) => void;
    onLogout: () => void;
    pokemonId: number;
    returnTo: string;
}> = ({ onNavigate, onLogout, pokemonId, returnTo }) => {
    const [pokemon, setPokemon] = useState<Pokemon | null>(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const getImagePath = (pokemonName: string) => {
        const specialCases: { [key: string]: string } = {
            'Nidoran♀': 'nidoranfemale',
            'Nidoran♂': 'nidoranmale',
            'Mr. Mime': 'mrmime',
            'Farfetch\'d': 'farfetchd',
            'Ho-Oh': 'hooh'
        };

        let finalPath;
        if (specialCases[pokemonName]) {
            finalPath = `/images/${specialCases[pokemonName]}.avif`;
        } else {
            const formattedName = pokemonName.toLowerCase()
                .replace(/['.:\s\-]/g, '')
                .replace(/♀/g, 'female')
                .replace(/♂/g, 'male');
            finalPath = `/images/${formattedName}.avif`;
        }

        return finalPath;
    };

    useEffect(() => {
        const fetchPokemonDetail = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('Token non trovato');
                    return;
                }

                const response = await fetch(`/api/v1/protected/pokemons/${pokemonId}`, {
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
                    console.log('Dati Pokemon ricevuti:', data);
                    setPokemon(data);
                } else {
                    const errorData = await response.text();
                    console.error('Errore dal server:', errorData);
                    setError('Errore nel caricamento del Pokemon');
                }
            } catch (err) {
                console.error('Errore di connessione:', err);
                setError('Errore di connessione al server');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPokemonDetail();
    }, [pokemonId, onLogout]);

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

        if (!pokemon) {
            return (
                <div className="alert alert-error text-center max-w-xl mx-auto">
                    Pokemon non trovato
                </div>
            );
        }

        return (
            <div className="card lg:card-side bg-base-100 shadow-xl max-w-6xl mx-auto">
                <figure className="lg:w-1/3 p-8 bg-gray-100">
                    <img 
                        src={getImagePath(pokemon.english_name)}
                        alt={pokemon.english_name}
                        className="rounded-xl max-h-96 object-contain"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/images/pikachu.jpg';
                        }}
                    />
                </figure>
                <div className="card-body lg:w-2/3">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="card-title text-4xl mb-2">{pokemon.english_name}</h2>
                            <p className="text-lg text-gray-600">{pokemon.classification}</p>
                        </div>
                        <p className="text-2xl font-bold">#{pokemon.national_number.toString().padStart(3, '0')}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <div>
                            <h3 className="text-xl font-bold mb-2">Informazioni Base</h3>
                            <p><span className="font-bold">Generazione:</span> {pokemon.gen}</p>
                            <p><span className="font-bold">Altezza:</span> {pokemon.height_m}m</p>
                            <p><span className="font-bold">Peso:</span> {pokemon.weight_kg}kg</p>
                            <p><span className="font-bold">Tasso di cattura:</span> {pokemon.capture_rate}</p>
                            <p><span className="font-bold">Genere:</span> ♂{pokemon.percent_male}% ♀{pokemon.percent_female}%</p>
                            
                            <div className="mt-4">
                                <span className="font-bold">Tipi:</span>
                                <div className="flex gap-2 mt-1">
                                    <span className="badge badge-lg">{pokemon.primary_type}</span>
                                    {pokemon.secondary_type && pokemon.secondary_type !== "" && (
                                        <span className="badge badge-lg">{pokemon.secondary_type}</span>
                                    )}
                                </div>
                            </div>

                            <div className="mt-4">
                                <span className="font-bold">Abilità:</span>
                                <ul className="list-disc list-inside mt-1">
                                    <li>{pokemon.abilities_0}</li>
                                    {pokemon.abilities_1 && pokemon.abilities_1 !== "" && (
                                        <li>{pokemon.abilities_1}</li>
                                    )}
                                    {pokemon.abilities_special && pokemon.abilities_special !== "" && (
                                        <li className="text-purple-600">{pokemon.abilities_special} (Speciale)</li>
                                    )}
                                </ul>
                            </div>

                            {(pokemon.evochain_0 || pokemon.evochain_2 || pokemon.evochain_4) && (
                                <div className="mt-4">
                                    <span className="font-bold">Catena Evolutiva:</span>
                                    <div className="flex items-center gap-2 mt-1">
                                        {pokemon.evochain_0 && <span>{pokemon.evochain_0}</span>}
                                        {pokemon.evochain_2 && <> → <span className="font-bold">{pokemon.evochain_2}</span></>}
                                        {pokemon.evochain_4 && <> → <span>{pokemon.evochain_4}</span></>}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div>
                            <h3 className="text-xl font-bold mb-2">Statistiche Base</h3>
                            <div className="space-y-2">
                                <div>
                                    <div className="flex justify-between">
                                        <span>HP:</span>
                                        <span>{pokemon.hp}</span>
                                    </div>
                                    <progress className="progress progress-success" value={pokemon.hp} max="255"></progress>
                                </div>
                                <div>
                                    <div className="flex justify-between">
                                        <span>Attacco:</span>
                                        <span>{pokemon.attack}</span>
                                    </div>
                                    <progress className="progress progress-error" value={pokemon.attack} max="255"></progress>
                                </div>
                                <div>
                                    <div className="flex justify-between">
                                        <span>Difesa:</span>
                                        <span>{pokemon.defense}</span>
                                    </div>
                                    <progress className="progress progress-warning" value={pokemon.defense} max="255"></progress>
                                </div>
                                <div>
                                    <div className="flex justify-between">
                                        <span>Velocità:</span>
                                        <span>{pokemon.speed}</span>
                                    </div>
                                    <progress className="progress progress-info" value={pokemon.speed} max="255"></progress>
                                </div>
                            </div>

                            {(pokemon.is_legendary === 1 || pokemon.is_mythical === 1) && (
                                <div className="mt-4 p-4 bg-yellow-100 rounded-lg">
                                    <p className="text-yellow-800 font-bold">
                                        {pokemon.is_legendary === 1 ? "Pokemon Leggendario" : "Pokemon Mitico"}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-6">
                        <h3 className="text-xl font-bold mb-2">Descrizione</h3>
                        <p className="text-white">{pokemon.description}</p>
                    </div>

                    <div className="card-actions justify-end mt-6">
                        <button 
                            className="btn btn-primary"
                            onClick={() => onNavigate(returnTo)}
                        >
                            Torna indietro
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div>
            <Header 
                title={`Dettagli ${pokemon?.english_name || 'Pokemon'}`}
                currentPage="detail"
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

export default PokemonDetailPage; 