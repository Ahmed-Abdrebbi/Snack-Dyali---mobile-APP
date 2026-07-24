import Plat from '../models/plat.js';

// GET /api/plats
export const getAllPlats = async (req, res) => {
  try {
    const plats = await Plat.findAll({ order: [['id', 'DESC']] });
    res.status(200).json(plats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/plats/:id
export const getPlatById = async (req, res) => {
  try {
    const plat = await Plat.findByPk(req.params.id);
    if (!plat) {
      return res.status(404).json({ error: 'Plat introuvable' });
    }
    res.status(200).json(plat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/plats
export const createPlat = async (req, res) => {
  try {
    const { nom, prix, categorie, disponible } = req.body;
    
    // Validation
    if (!nom || nom.trim() === '') {
      return res.status(400).json({ error: 'Le nom est obligatoire' });
    }
    if (prix === undefined || prix === null || isNaN(prix) || Number(prix) < 0) {
      return res.status(400).json({ error: 'Le prix doit être un nombre positif' });
    }
    if (!categorie || categorie.trim() === '') {
      return res.status(400).json({ error: 'La catégorie est obligatoire' });
    }

    const newPlat = await Plat.create({ nom, prix, categorie, disponible });
    res.status(201).json(newPlat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT /api/plats/:id
export const updatePlat = async (req, res) => {
  try {
    const { nom, prix, categorie, disponible } = req.body;
    const plat = await Plat.findByPk(req.params.id);
    
    if (!plat) {
      return res.status(404).json({ error: 'Plat introuvable' });
    }

    // Validation
    if (nom !== undefined && nom.trim() === '') {
      return res.status(400).json({ error: 'Le nom ne peut pas être vide' });
    }
    if (prix !== undefined && (isNaN(prix) || Number(prix) < 0)) {
      return res.status(400).json({ error: 'Le prix doit être un nombre positif' });
    }
    if (categorie !== undefined && categorie.trim() === '') {
      return res.status(400).json({ error: 'La catégorie ne peut pas être vide' });
    }

    await plat.update({ nom, prix, categorie, disponible });
    res.status(200).json(plat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE /api/plats/:id
export const deletePlat = async (req, res) => {
  try {
    const plat = await Plat.findByPk(req.params.id);
    if (!plat) {
      return res.status(404).json({ error: 'Plat introuvable' });
    }

    await plat.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};