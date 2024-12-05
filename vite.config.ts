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
						urlPattern: new RegExp("/.*\\.(?:html|css|js|wasm|pdf)$"),
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
				navigateFallbackAllowlist: [/^(?!\/__).*/],
				maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
			},
		}),
	],
	define: {
		"import.meta.env.VERSION": JSON.stringify(packageJson.version),
	},
});
