const createNextIntlPlugin = require("next-intl/plugin");

const withNextIntl = createNextIntlPlugin("./src/i18n.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
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
};

module.exports = withNextIntl(nextConfig);
