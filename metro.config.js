// Configuração do Metro (empacotador do Expo).
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// O polyfill de URL (react-native-url-polyfill, usado pelo app e pelo widget do Pluggy)
// faz require("punycode"). Na web, o Metro escolhe o ES module do pacote
// (punycode.es6.js), e o require recebe um objeto sem a propriedade "ucs2":
// "undefined is not an object (evaluating 'punycode.ucs2.decode')".
// Apontamos sempre para a versão CommonJS, que exporta o objeto completo.
const defaultResolve = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'punycode') {
    return { type: 'sourceFile', filePath: require.resolve('punycode/punycode.js') };
  }
  return (defaultResolve ?? context.resolveRequest)(context, moduleName, platform);
};

module.exports = config;
