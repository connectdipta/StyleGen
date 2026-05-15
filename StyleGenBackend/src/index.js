import app from "./app.js";
import connectDatabase from "./config/database.js";

import os from 'os';

const port = process.env.PORT || 4000;

const getNetworkIP = () => {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
};

connectDatabase();

const host = getNetworkIP();
app.listen(port, "0.0.0.0", () => {
  console.log(`\n🚀 Server is running on:`);
  console.log(`   - Local:    http://localhost:${port}`);
  console.log(`   - Network:  http://${host}:${port}`);
  console.log(`\n✅ MongoDB Atlas Connected Successfully\n`);
});
