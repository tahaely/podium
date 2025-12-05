const db = require('../config/db');
const serviceDePoints = require('./scoringService');
const { diffuser } = require('../config/socket');

const creerTache = async (donnees) => {
    const { team_id, member_id, title, description, points, difficulty, priority, deadline } = donnees;
    const [resultat] = await db.query(
        `INSERT INTO tasks (team_id, member_id, title, description, points, difficulty, priority, deadline) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [team_id, member_id, title, description, points, difficulty, priority, deadline]
    );
    return { id: resultat.insertId, ...donnees };
};

const modifierTache = async (id, donnees) => {
    const champs = [];
    const valeurs = [];

    // Gérer l'affectation du membre si user_id est fourni
    if (donnees.user_id) {
        // Trouver member_id pour cet utilisateur
        const [membres] = await db.query('SELECT id FROM members WHERE user_id = ?', [donnees.user_id]);
        if (membres.length > 0) {
            donnees.member_id = membres[0].id;
        }
        delete donnees.user_id; // Retirer de données pour éviter erreur de colonne
    }

    for (const [cle, valeur] of Object.entries(donnees)) {
        champs.push(`${cle} = ?`);
        valeurs.push(valeur);
    }
    valeurs.push(id);

    if (champs.length > 0) {
        await db.query(`UPDATE tasks SET ${champs.join(', ')} WHERE id = ?`, valeurs);
    }

    return { id, ...donnees };
};

const televerserPreuve = async (id, urlPreuve) => {
    await db.query('UPDATE tasks SET proof_url = ?, status = ? WHERE id = ?', [urlPreuve, 'done', id]);
    return { id, proof_url: urlPreuve, status: 'done' };
};

const validerTache = async (id) => {
    const [taches] = await db.query('SELECT * FROM tasks WHERE id = ?', [id]);
    if (taches.length === 0) throw new Error('Tâche non trouvée');
    const tache = taches[0];

    if (tache.status === 'validated') throw new Error('Tâche déjà validée');
    if (tache.status !== 'done') throw new Error('La tâche doit être terminée pour être validée');

    let pointsAttribues = tache.points;
    let raison = `Achèvement de la tâche: ${tache.title}`;

    // Bonus: +20% si terminé avant la deadline
    if (tache.deadline && new Date() < new Date(tache.deadline)) {
        pointsAttribues += Math.round(tache.points * 0.2);
        raison += ' (Bonus Anticipation)';
    }

    // Mettre à jour le statut de la tâche
    await db.query('UPDATE tasks SET status = ?, validated_at = NOW() WHERE id = ?', ['validated', id]);

    // Enregistrer les points (seulement si member_id existe)
    if (tache.member_id) {
        await serviceDePoints.ajouterPoints(tache.team_id, tache.member_id, id, pointsAttribues, raison);

        // Vérifier la série
        const serieAttribuee = await serviceDePoints.verifierSerie(tache.member_id);

        // Diffuser la mise à jour
        diffuser({ type: 'TACHE_VALIDEE', idTache: id, idEquipe: tache.team_id, points: pointsAttribues, serie: serieAttribuee });

        return { id, statut: 'validated', pointsAttribues, serieAttribuee };
    } else {
        // Aucun membre assigné, attribuer les points à l'équipe
        await serviceDePoints.ajouterPoints(tache.team_id, null, id, pointsAttribues, raison);

        // Diffuser la mise à jour
        diffuser({ type: 'TACHE_VALIDEE', idTache: id, idEquipe: tache.team_id, points: pointsAttribues });

        return { id, statut: 'validated', pointsAttribues };
    }
};

const obtenirTaches = async (filtres) => {
    let requete = `
        SELECT t.*, m.name as nom_membre, m.avatar_url as avatar_membre, tm.name as nom_equipe
        FROM tasks t
        LEFT JOIN members m ON t.member_id = m.id
        LEFT JOIN teams tm ON t.team_id = tm.id
    `;
    const parametres = [];
    const conditions = [];

    if (filtres.team_id) {
        conditions.push('t.team_id = ?');
        parametres.push(filtres.team_id);
    }
    if (filtres.member_id) {
        conditions.push('t.member_id = ?');
        parametres.push(filtres.member_id);
    }
    if (filtres.status) {
        conditions.push('t.status = ?');
        parametres.push(filtres.status);
    }

    if (conditions.length > 0) {
        requete += ' WHERE ' + conditions.join(' AND ');
    }

    const [taches] = await db.query(requete, parametres);
    return taches;
};

module.exports = { creerTache, modifierTache, televerserPreuve, validerTache, obtenirTaches };
