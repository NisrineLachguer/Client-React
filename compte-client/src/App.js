import React, { useState } from 'react';
import CompteList from './components/CompteList';
import CompteForm from './components/CompteForm';
import './App.css';

function App() {
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Fonction pour rafraîchir la liste des comptes
    const refreshComptes = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <div className="app-container">
            <header className="app-header">
                <div className="container">
                    <h1 className="app-title">🏦 Gestion Bancaire</h1>
                    <p className="app-subtitle">Système de gestion des comptes</p>
                </div>
            </header>

            <main className="app-main">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4">
                            <div className="form-section">
                                <CompteForm onCompteAdded={refreshComptes} />
                            </div>
                        </div>
                        <div className="col-lg-8">
                            <div className="list-section">
                                <CompteList refreshTrigger={refreshTrigger} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default App;