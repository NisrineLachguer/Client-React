import React, { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from "../config";
import './CompteForm.css';

function CompteForm({ onCompteAdded }) {
    const [compte, setCompte] = useState({ solde: '', dateCreation: '', type: 'COURANT' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    const handleChange = (e) => {
        setCompte({ ...compte, [e.target.name]: e.target.value });
        // Effacer le message quand l'utilisateur modifie le formulaire
        if (message.text) setMessage({ text: '', type: '' });
    };

    const showMessage = (text, type = 'success') => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const compteData = {
            solde: parseFloat(compte.solde) || 0,
            dateCreation: compte.dateCreation,
            type: compte.type || 'COURANT'
        };

        console.log('Data being sent:', compteData);

        axios.post(`${API_BASE_URL}/comptes`, compteData)
            .then(response => {
                console.log('Response:', response);

                // Réinitialiser le formulaire
                setCompte({ solde: '', dateCreation: '', type: 'COURANT' });

                // Rafraîchir la liste
                onCompteAdded();

                // Message de succès
                showMessage('✓ Compte ajouté avec succès!', 'success');
            })
            .catch(error => {
                console.error('Error:', error);
                showMessage('✗ Erreur lors de l\'ajout du compte', 'error');
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    return (
        <div className="compte-form-container">
            <div className="form-header">
                <h2>➕ Nouveau Compte</h2>
                <p>Créer un nouveau compte bancaire</p>
            </div>

            {message.text && (
                <div className={`alert-message ${message.type}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="compte-form">
                <div className="form-group">
                    <label className="form-label">💵 Solde Initial</label>
                    <input
                        type="number"
                        name="solde"
                        className="form-control modern-input"
                        value={compte.solde}
                        onChange={handleChange}
                        step="0.01"
                        placeholder="0.00"
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">📅 Date de Création</label>
                    <input
                        type="date"
                        name="dateCreation"
                        className="form-control modern-input"
                        value={compte.dateCreation}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">🏦 Type de Compte</label>
                    <select
                        name="type"
                        className="form-control modern-select"
                        value={compte.type}
                        onChange={handleChange}
                        required
                    >
                        <option value="COURANT">💳 Compte Courant</option>
                        <option value="EPARGNE">💰 Compte Épargne</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <span className="spinner"></span>
                            Création...
                        </>
                    ) : (
                        '✨ Créer le Compte'
                    )}
                </button>
            </form>
        </div>
    );
}

export default CompteForm;