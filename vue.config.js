// vue.config.js

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  filenameHashing: true,
  css: {
    extract: true // يستخرج CSS إلى ملفات منفصلة لتقليل المشاكل في العرض
  }
}
