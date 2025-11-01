import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// ⚙️ Configuración especial para GitHub Pages
export default defineConfig({
  plugins: [react()],
  base: '/proyecto-GDI2/', // 👈 el nombre del repositorio, con la barra al inicio y final
});
