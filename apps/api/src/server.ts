import { createApp } from "./app";
import { config } from "./config/env";

const app = createApp();

app.listen(config.port, () => {
  console.log(`[Aegis API] Server running on http://localhost:${config.port} (${config.nodeEnv})`);
});
