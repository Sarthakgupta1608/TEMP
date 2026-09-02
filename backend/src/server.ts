import app from './app';
import { config } from './config';

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`🚀 Traveller Backend API listening on http://localhost:${PORT}`);
  console.log(`🌍 Health Check Endpoint: http://localhost:${PORT}/health`);
  console.log(`🔐 CORS Allowed Origin: ${config.frontendUrl}`);
});
