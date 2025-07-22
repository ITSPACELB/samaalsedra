// vue.config.js

module.exports = {
  publicPath: '/',
  filenameHashing: true,
  assetsDir: 'assets', // تحديد مجلد الأصول
  css: {
    extract: true, // استخراج CSS في ملف منفصل
    loaderOptions: {
      css: {
        modules: false
      }
    }
  },
  chainWebpack: (config) => {
    // دعم custom elements
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap((options) => {
        return {
          ...options,
          compilerOptions: {
            isCustomElement: (tag) => tag.startsWith('xai-')
          }
        };
      });

    // دعم تحميل الخطوط
    config.module
      .rule('fonts')
      .test(/\.(woff2?|eot|ttf|otf)(\?.*)?$/)
      .use('url-loader')
      .loader('url-loader')
      .tap(() => ({
        limit: 10000, // تحويل الملفات الصغيرة إلى base64
        name: 'fonts/[name].[hash:7].[ext]'
      }));
  }
};
