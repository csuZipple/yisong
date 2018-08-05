module.exports = function override(config, env) {
  // do stuff with the webpack config...
  // config = injectBabelPlugin(['import', {
  //   libraryName: 'antd',
  //   style: true
  // }], config); // change importing css to less
  // config = rewireLess.withLoaderOptions({
  //   javascriptEnabled: true,
  //   modifyVars: {
  //     "@primary-color": "#1DA57A"
  //   },
  // })(config, env);

  message.config({
    top: 100,
    duration: 2,
    maxCount: 3,
  });
  return config;
};