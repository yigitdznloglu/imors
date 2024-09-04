const app = require("./app");
const mongoose = require("mongoose");
const fs = require("fs");
const https = require("https");
const http = require("http");
const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 3000;
const MONGO = process.env.MONGO;
const ENVIRONMENT = process.env.NODE_ENV || 'development';

async function main() {
  // Connect to MongoDB
  await mongoose.connect(`mongodb://${MONGO}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  if (ENVIRONMENT === 'production') {
    // SSL/TLS Certificates
    const key = fs.readFileSync(process.env.SSL_KEY_PATH, 'utf8');
    const cert = fs.readFileSync(process.env.SSL_CERT_PATH, 'utf8');
    const ca = fs.readFileSync(process.env.SSL_CA_PATH, 'utf8');

    const credentials = { key, cert, ca };

    // Create HTTPS server
    const httpsServer = https.createServer(credentials, app);

    httpsServer.listen(PORT, () => {
      console.log(`HTTPS Server listening on port ${PORT}`);
    });
  } else {
    // Create HTTP server for local development
    const httpServer = http.createServer(app);

    httpServer.listen(PORT, () => {
      console.log(`HTTP Server listening on port ${PORT}`);
    });
  }
}

main().catch((err) => console.error(err));