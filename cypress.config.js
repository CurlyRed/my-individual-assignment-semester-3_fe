import { defineConfig } from 'cypress';
import dotenv from 'dotenv';

const env = dotenv.config().parsed;

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      config.env = {
        ...config.env,
        ...env,
      };

      return config;
    },
    baseUrl: 'http://localhost:5173', 
    viewportWidth: 1280,
    viewportHeight: 720,
  },
});

