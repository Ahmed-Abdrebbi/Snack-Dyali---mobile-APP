export const openapiSpec = {
  openapi: '3.1.0',
  info: {
    title: 'Snack Dyali API',
    version: '1.0.0',
    description: 'API pour la gestion du menu du Snack Dyali',
  },
  paths: {
    '/api/plats': {
      get: {
        summary: 'Lister les plats',
        description: 'Retourne la liste de tous les plats.',
        responses: {
          '200': {
            description: 'Succès',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Plat' },
                },
              },
            },
          },
        },
      },
      post: {
        summary: 'Ajouter un plat',
        description: 'Crée un nouveau plat.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/PlatInput' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Plat créé avec succès',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Plat' },
              },
            },
          },
          '400': { description: 'Données invalides' },
        },
      },
    },
    '/api/plats/{id}': {
      get: {
        summary: 'Détail d\'un plat',
        description: 'Retourne les détails d\'un plat spécifique.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          '200': {
            description: 'Succès',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Plat' },
              },
            },
          },
          '404': { description: 'Plat introuvable' },
        },
      },
      put: {
        summary: 'Modifier un plat',
        description: 'Met à jour un plat existant.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/PlatInput' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Plat mis à jour avec succès',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Plat' },
              },
            },
          },
          '400': { description: 'Données invalides' },
          '404': { description: 'Plat introuvable' },
        },
      },
      delete: {
        summary: 'Supprimer un plat',
        description: 'Supprime un plat existant.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          '204': { description: 'Plat supprimé avec succès' },
          '404': { description: 'Plat introuvable' },
        },
      },
    },
  },
  components: {
    schemas: {
      Plat: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          nom: { type: 'string' },
          prix: { type: 'number', format: 'float' },
          categorie: { type: 'string' },
          disponible: { type: 'boolean' },
          created_at: { type: 'string', format: 'date-time' },
        },
      },
      PlatInput: {
        type: 'object',
        required: ['nom', 'prix', 'categorie'],
        properties: {
          nom: { type: 'string' },
          prix: { type: 'number', format: 'float' },
          categorie: { type: 'string' },
          disponible: { type: 'boolean', default: true },
        },
      },
    },
  },
};