import React, { useState } from 'react';
import Header from "../atoms/Header";
import Footer from "../atoms/Footer";

interface LoginProps {
    onLoginSuccess: () => void;
    onNavigate: (page: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, onNavigate }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const formData = new URLSearchParams();
            formData.append('username', username);
            formData.append('password', password);

            const response = await fetch('/api/v1/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData.toString()
            });

            const responseText = await response.text();

            if (response.ok) {
                try {
                    const responseData = JSON.parse(responseText);
                    if (responseData.token) {
                        localStorage.setItem('token', responseData.token);
                        onLoginSuccess();
                    }
                } catch (parseError) {
                    setError('Errore nel formato della risposta');
                }
            } else {
                setError(responseText);
            }
        } catch (err) {
            console.error('Errore di connessione:', err);
            setError('Errore di connessione al server');
        }
    };

    return (
        <div>
            <Header 
                title="Login Pokemon" 
                currentPage="login"
                onNavigate={onNavigate}
            />
            <div className="hero min-h-screen bg-orange-500">
                <div className="hero-content flex-col lg:flex-row-reverse">
                    <img
                        src="/public/images/pikachu.jpg"
                        alt="Pikachu"
                        className="max-w-sm rounded-lg shadow-2xl size-96"
                    />
                    <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                        <div className="card-body">
                            <h2 className="text-3xl font-bold text-center mb-4">Accedi al Pokedex</h2>
                            {error && (
                                <div className="alert alert-error mb-4 text-center font-bold">
                                    {error}
                                </div>
                            )}
                            <form onSubmit={handleSubmit}>
                                <div className="form-control">
                                    <label className="label" htmlFor="username">
                                        <span className="label-text">Username:</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="input input-bordered w-full"
                                        required
                                    />
                                </div>
                                <div className="form-control mt-4">
                                    <label className="label" htmlFor="password">
                                        <span className="label-text">Password:</span>
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="input input-bordered w-full"
                                        required
                                    />
                                </div>
                                <div className="form-control mt-6">
                                    <button type="submit" className="btn btn-primary">Accedi</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Login; 