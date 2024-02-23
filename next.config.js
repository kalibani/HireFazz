/** @type {import('next').NextConfig} */
const nextTranslate = require("next-translate-plugin");
const nextConfig = nextTranslate({
	// experimental: { appDir: true },
	images: {
		domains: [
			"googleusercontent.com",
			"oaidalleapiprodscus.blob.core.windows.net",
			"cdn.openai.com",
		],
	},
	webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
		config.resolve.alias.canvas = false;
		config.resolve.alias.encoding = false;
		return config;
	},
});

module.exports = nextConfig;
