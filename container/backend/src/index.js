import { isOperationalError, logError } from "./middlewares/errorLogger";
import app from "./app";

let PORT = process.env.PORT ?? 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// if the Promise is rejected this will catch it
process.on("unhandledRejection", (err, _) => {
  logError(err);
  throw err;
  // httpServer.close(() => process.exit(1));
});

process.on("uncaughtException", (error) => {
  logError(error);
  if (!isOperationalError(error)) {
    process.exit(1);
  }
});
