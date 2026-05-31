require("dotenv").config();
const buildApp = require("./app");

//const { connection: mongoConnection } = require("./Infraestructura/database/Mongo");
const {
  connection: pgConnection,
} = require("./Infraestructura/database/Postgres");
const { syncModels } = require("./models/index");
const { seedUsuarios } = require("./seed");

async function start() {
  const port = Number(process.env.PORT) || 3977;

  // conectar ambas BD
  //await mongoConnection();
  await pgConnection();
  await syncModels();
  await seedUsuarios();

  console.log("PostgreSQL conectados");

  const app = buildApp();

  app.listen(port, () => {
    console.log("Servidor corriendo en puerto: " + port);
  });
}

start().catch((e) => {
  console.error("Fallo al iniciar la aplicación:", e);
  process.exit(1);
});
