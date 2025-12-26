module.exports = {
  style: {
    postcss: {
      plugins: [require("tailwindcss"), require("autoprefixer")],
    },
  },
  webpack: {
    configure: (webpackConfig) => {
      // Disable React Refresh in production
      if (process.env.NODE_ENV === "production") {
        webpackConfig.plugins = webpackConfig.plugins.filter(
          (plugin) => plugin.constructor.name !== "ReactRefreshPlugin"
        );
      }
      return webpackConfig;
    },
  },
};
