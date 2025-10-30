import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';
import './CompteList.css';

function CompteList({ refreshTrigger }) {
    const [comptes, setComptes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastAdded, setLastAdded] = useState(null);

    useEffect(() => {
        setLoading(true);
        axios.get(`${API_BASE_URL}/comptes`)
            .then(response => {
                setComptes(response.data);

                // Identifier le dernier compte ajouté pour l'animation
                if (response.data.length > 0 && refreshTrigger > 0) {
                    const newCompte = response.data[response.data.length - 1];
                    setLastAdded(newCompte.id);
                    setTimeout(() => setLastAdded(null), 3000);
                }
            })
            .catch(error => {
                console.error('Error fetching accounts:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [refreshTrigger]);

    const getTypeIcon = (type) => {
        return type === 'COURANT' ? '💳' : '💰';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatSolde = (solde) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR'
        }).format(solde);
    };

    if (loading) {
        return (
            <div className="compte-list-container">
                <div className="list-header">
                    <h2>📋 Liste des Comptes</h2>
                    <div className="stats">Chargement...</div>
                </div>
                <div className="loading-spinner">
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="compte-list-container">
            <div className="list-header">
                <h2>📋 Liste des Comptes</h2>
                <div className="stats">
                    <span className="count-badge">{comptes.length} compte(s)</span>
                </div>
            </div>

            {comptes.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">🏦</div>
                    <h3>Aucun compte trouvé</h3>
                    <p>Créez votre premier compte pour commencer</p>
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="compte-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Type</th>
                            <th>Solde</th>
                            <th>Date de Création</th>
                            <th>Statut</th>
                        </tr>
                        </thead>
                        <tbody>
                        {comptes.map(compte => (
                            <tr
                                key={compte.id}
                                className={`
                                        ${lastAdded === compte.id ? 'new-row fade-in-up' : ''}
                                        ${compte.solde >= 0 ? 'positive' : 'negative'}
                                    `}
                            >
                                <td className="compte-id">#{compte.id}</td>
                                <td className="compte-type">
                                    <span className="type-icon">{getTypeIcon(compte.type)}</span>
                                    {compte.type === 'COURANT' ? 'Courant' : 'Épargne'}
                                </td>
                                <td className={`compte-solde ${compte.solde >= 0 ? 'positive' : 'negative'}`}>
                                    {formatSolde(compte.solde)}
                                </td>
                                <td className="compte-date">{formatDate(compte.dateCreation)}</td>
                                <td>
                                        <span className={`status-badge ${compte.solde >= 0 ? 'active' : 'overdraft'}`}>
                                            {compte.solde >= 0 ? 'Actif' : 'Découvert'}
                                        </span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default CompteList;