const db = require('../config/db');

const ajouterMembre = async (idEquipe, idUtilisateur, nom, role, urlAvatar) => {
    const [resultat] = await db.query(
        'INSERT INTO members (team_id, user_id, name, role, avatar_url) VALUES (?, ?, ?, ?, ?)',
        [idEquipe, idUtilisateur, nom, role, urlAvatar]
    );
    return { id: resultat.insertId, idEquipe, idUtilisateur, nom, role, urlAvatar };
};

const retirerMembre = async (id) => {
    await db.query('DELETE FROM members WHERE id = ?', [id]);
};

const modifierMembre = async (id, nom, role, urlAvatar) => {
    await db.query(
        'UPDATE members SET name = ?, role = ?, avatar_url = ? WHERE id = ?',
        [nom, role, urlAvatar, id]
    );
    return { id, nom, role, urlAvatar };
};

const obtenirTousLesMembres = async (idEquipe) => {
    let requete = 'SELECT * FROM members';
    let parametres = [];

    if (idEquipe) {
        requete += ' WHERE team_id = ?';
        parametres.push(idEquipe);
    }

    const [membres] = await db.query(requete, parametres);
    return membres;
};

const obtenirMembreParId = async (id) => {
    const [membres] = await db.query('SELECT * FROM members WHERE id = ?', [id]);
    return membres[0];
};

module.exports = { ajouterMembre, retirerMembre, modifierMembre, obtenirTousLesMembres, obtenirMembreParId };
