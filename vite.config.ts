import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import wasm from "vite-plugin-wasm";
import { VitePWA } from "vite-plugin-pwa";
import packageJson from "./package.json";

export default defineConfig({
	base: "/diablo_web_simple/",
	plugins: [
		react(),
		wasm(),
		VitePWA({
			base: "/diablo_web_simple/",
			registerType: "autoUpdate",
			workbox: {
				runtimeCaching: [
					{
						urlPattern: /.*\.pdf$/,
						handler: "NetworkFirst",
						options: {
							cacheName: "pdf-cache",
							expiration: {
								maxEntries: 5,
								maxAgeSeconds: 7 * 24 * 60 * 60,
							},
						},
					},
					{
						urlPattern: new RegExp("/.*\\.(?:html|css|js|wasm)$"),
						handler: "CacheFirst",
						options: {
							cacheName: "static-resources",
							expiration: {
								maxEntries: 50,
								maxAgeSeconds: 30 * 24 * 60 * 60,
							},
						},
					},
				],
				navigateFallback: "/diablo_web_simple/index.html",
				navigateFallbackAllowlist: [/^(?!.*\.pdf$).*$/],
			},
		}),
	],
	define: {
		__APP_VERSION__: JSON.stringify(packageJson.version),
	},
});
