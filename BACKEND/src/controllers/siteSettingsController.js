const { SiteSettings } = require('../models');
const path = require('path');
const fs = require('fs');

module.exports = {
  // GET - Obtener configuración del sitio (público)
  getSettings: async (req, res) => {
    try {
      let settings = await SiteSettings.findOne();

      // Si no existe, crear configuración por defecto
      if (!settings) {
        settings = await SiteSettings.create({
          siteName: 'PC Store',
          siteSlogan: 'Los mejores componentes PC',
          primaryColor: '#667eea',
          secondaryColor: '#764ba2',
          currency: '$',
          taxRate: 16.00,
          shippingCost: 50.00,
          freeShippingThreshold: 1000.00
        });
      }

      res.json(settings);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Cannot fetch site settings', details: err.message });
    }
  },

  // PUT - Actualizar configuración (ADMIN)
  updateSettings: async (req, res) => {
    try {
      let settings = await SiteSettings.findOne();

      if (!settings) {
        settings = await SiteSettings.create(req.body);
      } else {
        // Preservar logo y favicon existentes si no se envían nuevos
        const updateData = { ...req.body };

        // Si logo no viene en el body o está vacío, mantener el existente
        if (!updateData.logo && settings.logo) {
          updateData.logo = settings.logo;
        }

        // Manejar logo si se subió uno nuevo
        if (req.file) {
          const logoUrl = `/uploads/site/${req.file.filename}`;
          updateData.logo = logoUrl;
        }

        await settings.update(updateData);
      }

      res.json(settings);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Cannot update site settings', details: err.message });
    }
  },

  // POST - Subir logo (ADMIN)
  uploadLogo: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const logoUrl = `/uploads/site/${req.file.filename}`;
      let settings = await SiteSettings.findOne();

      if (!settings) {
        settings = await SiteSettings.create({ logo: logoUrl });
      } else {
        // Eliminar logo anterior si existe
        if (settings.logo) {
          const oldLogoPath = path.join(__dirname, '../../public', settings.logo);
          if (fs.existsSync(oldLogoPath)) {
            fs.unlinkSync(oldLogoPath);
          }
        }
        await settings.update({ logo: logoUrl });
      }

      res.json({ logoUrl, settings });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Cannot upload logo', details: err.message });
    }
  },

};
