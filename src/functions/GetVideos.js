const { app } = require('@azure/functions');
const { CosmosClient } = require("@azure/cosmos");

app.http('GetVideos', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Appel de l'API GetVideos...`);

        const connectionString = process.env["COSMOS_DB_CONNECTION"];

        try {
            // On vérifie si la clé est bien chargée
            if (!connectionString) {
                throw new Error("La variable COSMOS_DB_CONNECTION est absente de local.settings.json");
            }

            const client = new CosmosClient(connectionString);
            const database = client.database("MediaDB");
            const container = database.container("Videos");

            // Requête
            const { resources: items } = await container.items
                .query("SELECT * from c")
                .fetchAll();

            return {
                status: 200,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(items)
            };

        } catch (error) {
            // Correction ici : on utilise context.log pour afficher l'erreur
            context.log("ERREUR DÉTECTÉE :");
            context.log(error.message);
            
            return {
                status: 500,
                body: JSON.stringify({ error: "Erreur de base de données", details: error.message })
            };
        }
    }
});