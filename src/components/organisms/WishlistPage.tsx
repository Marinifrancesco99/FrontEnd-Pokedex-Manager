import React, { useEffect, useState } from "react";
import Header from "../atoms/Header";
import Footer from "../atoms/Footer";

interface Pokemon {
    national_number: number;
    gen: string;
    english_name: string;
    primary_type: string;
    secondary_type: string | null;
    image_url?: string;
}

// Riutilizziamo lo stesso PokemonCard component
const PokemonCard: React.FC<{ 
    pokemon: Pokemon;
    onNavigate: (page: string, pokemonId?: number) => void;
    onDelete: () => void;
}> = ({ pokemon, onNavigate, onDelete }) => {
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

    const handleDeleteFromWishlist = async (e: React.MouseEvent) => {
        e.stopPropagation();
        
        const modalContainer = document.createElement('div');
        modalContainer.className = 'fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'bg-gray-800 p-8 rounded-2xl shadow-2xl transform transition-all max-w-md w-full mx-4';
        modalContent.innerHTML = `
            <div class="text-center">
                <img src="${getImagePath(pokemon.english_name)}" 
                     alt="${pokemon.english_name}" 
                     class="w-32 h-32 mx-auto mb-4 object-contain bg-gray-700 rounded-xl p-2"
                     onerror="this.src='/images/pikachu.jpg'"
                />
                <div id="messageContainer">
                    <p class="text-xl font-bold text-white mb-6">
                        Sei sicuro di voler eliminare <span class="text-emerald-400">${pokemon.english_name}</span> dalla Wishlist?
                    </p>
                    <div class="flex justify-center gap-4">
                        <button id="cancelBtn" class="btn bg-red-500 hover:bg-red-600 text-white border-none">
                            Annulla
                        </button>
                        <button id="confirmBtn" class="btn bg-emerald-500 hover:bg-emerald-600 text-white border-none">
                            OK
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        modalContainer.appendChild(modalContent);
        document.body.appendChild(modalContainer);

        const showResult = async (response: Response) => {
            const messageContainer = modalContent.querySelector('#messageContainer');
            if (messageContainer) {
                try {
                    let message = await response.text();
                    const isSuccess = response.ok;
                    
                    message = message
                        .replace(/error:\s*/gi, '')
                        .replace(/error\s*/gi, '')
                        .replace(/message['":\s]+/gi, '')
                        .replace(/national[_\s]*number[_\s]*[0-9]+/gi, pokemon.english_name)
                        .replace(/[{}"]/g, '')
                        .replace(/:\s*/g, ' ')
                        .replace(/["{]Pokemon eliminato dalla wishlist con successo[}"].*/i, 'Pokemon eliminato dalla wishlist con successo!')
                        .replace(/,\s*national_number[^,}]*/, '')
                        .trim();
                    
                    messageContainer.innerHTML = `
                        <div class="text-center">
                            <p class="text-xl font-bold ${isSuccess ? 'text-emerald-400' : 'text-red-400'} mb-4">
                                ${message}
                            </p>
                            <button id="closeBtn" class="btn bg-gray-600 hover:bg-gray-700 text-white border-none">
                                Chiudi
                            </button>
                        </div>
                    `;
                    
                    if (isSuccess) {
                        modalContent.querySelector('#closeBtn')?.addEventListener('click', () => {
                            document.body.removeChild(modalContainer);
                            onDelete();
                        });
                    } else {
                        modalContent.querySelector('#closeBtn')?.addEventListener('click', () => {
                            document.body.removeChild(modalContainer);
                        });
                    }
                } catch (err) {
                    messageContainer.innerHTML = `
                        <div class="text-center">
                            <p class="text-xl font-bold text-red-400 mb-4">
                                Si è verificato un problema durante l'operazione
                            </p>
                            <button id="closeBtn" class="btn bg-gray-600 hover:bg-gray-700 text-white border-none">
                                Chiudi
                            </button>
                        </div>
                    `;
                }
            }
        };

        const closeModal = () => {
            document.body.removeChild(modalContainer);
        };

        return new Promise((resolve) => {
            modalContent.querySelector('#cancelBtn')?.addEventListener('click', () => {
                closeModal();
                resolve(false);
            });

            modalContent.querySelector('#confirmBtn')?.addEventListener('click', async () => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await fetch(`/api/v1/protected/wishlist/${pokemon.national_number}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    await showResult(response);
                } catch (err) {
                    console.error('Errore:', err);
                    const messageContainer = modalContent.querySelector('#messageContainer');
                    if (messageContainer) {
                        messageContainer.innerHTML = `
                            <div class="text-center">
                                <p class="text-xl font-bold text-red-400 mb-4">
                                    Errore di connessione al server
                                </p>
                                <button id="closeBtn" class="btn bg-gray-600 hover:bg-gray-700 text-white border-none">
                                    Chiudi
                                </button>
                            </div>
                        `;
                        
                        modalContent.querySelector('#closeBtn')?.addEventListener('click', () => {
                            document.body.removeChild(modalContainer);
                        });
                    }
                }
            });

            modalContainer.addEventListener('click', (e) => {
                if (e.target === modalContainer) {
                    closeModal();
                    resolve(false);
                }
            });
        });
    };

    return (
        <div 
            className="card w-72 bg-base-100 shadow-xl hover:shadow-2xl transition-shadow cursor-pointer" 
            onClick={() => onNavigate('detail', pokemon.national_number)}
        >
            <figure className="px-6 pt-6 h-48 flex items-center justify-center bg-gray-100 rounded-t-xl">
                <img 
                    src={getImagePath(pokemon.english_name)}
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
                <div className="card-actions justify-center mt-4">
                    <button 
                        className="btn btn-error btn-sm"
                        onClick={handleDeleteFromWishlist}
                    >
                        Elimina dalla Wishlist
                    </button>
                </div>
            </div>
        </div>
    );
};

const WishlistPage: React.FC<{ onNavigate: (page: string) => void; onLogout: () => void }> = ({ onNavigate, onLogout }) => {
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

                const response = await fetch('/api/v1/protected/wishlist', {
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
                    if (Array.isArray(data)) {
                        setPokemons(data);
                    } else {
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
                        onNavigate={onNavigate}
                        onDelete={() => {
                            const newPokemons = pokemons.filter(p => p.national_number !== pokemon.national_number);
                            setPokemons(newPokemons);
                        }}
                    />
                ))}
            </div>
        );
    };

    return (
        <div>
            <Header 
                title="Wishlist Pokemon" 
                currentPage="wishlist"
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

export default WishlistPage; 