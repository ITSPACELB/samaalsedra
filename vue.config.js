// vue.config.js

module.exports = {
  publicPath: '/',
  filenameHashing: true,
  css: {
    extract: true,
    loaderOptions: {
      css: {
        modules: false
      }
    }
  },
  chainWebpack: (config) => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap((options) => {
        return {
          ...options,
          compilerOptions: {
            isCustomElement: (tag) => tag.startsWith('xai-') // لدعم custom elements إذا لزم
          }
        };
      });
  }
};
