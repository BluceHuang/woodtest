/**
 * Wood Plugin Module.
 * 根据注释生成api文档
 * by jlego on 2018-11-17
 */
const Docx = require('./src/docx');

module.exports = (app = {}, config = {}) => {
  app.Docx = Docx;
  const Router = require('wood-router')(app).Router;
  app.application.use(app.express.static('docs'));
  Router().get(Docx.path, Docx.fun);
  return app;
}
