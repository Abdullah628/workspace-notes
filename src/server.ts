/* eslint-disable no-console */
// import { Server } from "http";
import http from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./config/env";
import { startHistoryRetentionJob } from "./jobs/historyRetention";
import { enableMongooseDebug } from "./middleware/queryPerformance";

let server: http.Server;

const startServer = async () => {
  try {
    await mongoose.connect(envVars.DB_URL);

    console.log("Connected to DB!!");
    
    // Enable MongoDB query logging (comment out in production)
    // if (envVars.NODE_ENV === "development") {
      enableMongooseDebug();
      console.log("📊 MongoDB query profiling enabled");
    // }
    
    startHistoryRetentionJob();

    // Create HTTP server
    server = http.createServer(app);

    // Listen using the same server that Socket.IO is attached to
    server.listen(envVars.PORT, () => {
      console.log(`Server is listening on port ${envVars.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

(async () => {
  await startServer();
})();



process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejecttion detected... Server shutting down..", err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception detected... Server shutting down..", err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});
