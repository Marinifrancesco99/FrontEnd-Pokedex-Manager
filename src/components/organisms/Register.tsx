import React, { useState } from 'react';

const Register: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const modalContainer = document.createElement('div');
        modalContainer.className = 'fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'bg-gray-800 p-8 rounded-2xl shadow-2xl transform transition-all max-w-md w-full mx-4';
        modalContent.innerHTML = `
            <div class="text-center">
                <img src="/images/pikachu.jpg" 
                     alt="Pokemon" 
                     class="w-32 h-32 mx-auto mb-4 object-contain bg-gray-700 rounded-xl p-2"
                />
                <div id="messageContainer">
                    <p class="text-xl font-bold text-white mb-6">
                        Sei sicuro di volerti registrare?
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
                        .replace(/[{}"]/g, '')
                        .replace(/:\s*/g, ' ')
                        .trim();
                    
                    messageContainer.innerHTML = `
                        <div class="text-center">
                            <p class="text-xl font-bold ${isSuccess ? 'text-emerald-400' : 'text-red-400'} mb-4">
                                ${isSuccess ? 'Registrazione completata con successo!' : message}
                            </p>
                            <button id="closeBtn" class="btn bg-gray-600 hover:bg-gray-700 text-white border-none">
                                Chiudi
                            </button>
                        </div>
                    `;
                    
                    modalContent.querySelector('#closeBtn')?.addEventListener('click', () => {
                        document.body.removeChild(modalContainer);
                        if (isSuccess) {
                            onNavigate('home');
                        }
                    });
                } catch (err) {
                    messageContainer.innerHTML = `
                        <div class="text-center">
                            <p class="text-xl font-bold text-red-400 mb-4">
                                Si è verificato un problema durante la registrazione
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

        modalContent.querySelector('#cancelBtn')?.addEventListener('click', () => {
            closeModal();
        });

        modalContent.querySelector('#confirmBtn')?.addEventListener('click', async () => {
            try {
                const formData = new URLSearchParams();
                formData.append('username', username);
                formData.append('password', password);
                formData.append('email', email);

                const response = await fetch('/api/v1/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: formData
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
    };

    return (
        <div className="min-h-screen bg-orange-500 flex items-center justify-center p-4">
            <div className="card w-96 bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title justify-center text-2xl mb-4">Registrazione</h2>
                    {error && <div className="alert alert-error mb-4">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text">Username</span>
                            </label>
                            <input 
                                type="text" 
                                className="input input-bordered w-full" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input 
                                type="password" 
                                className="input input-bordered w-full" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input 
                                type="email" 
                                className="input input-bordered w-full" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="card-actions justify-end mt-6">
                            <button 
                                type="button"
                                className="btn btn-ghost"
                                onClick={() => onNavigate('home')}
                            >
                                Annulla
                            </button>
                            <button 
                                type="submit" 
                                className="btn btn-primary"
                            >
                                Registrati
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register; 