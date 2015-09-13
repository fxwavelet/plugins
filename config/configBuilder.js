module.exports = function(defaultConfig) {
  var config = null;
  var optionConfig = defaultConfig || {};

  return {
    all: function() {
      return config || optionConfig
    },
    get: function(name) {
      if (!config) {
        if (!optionConfig) {
          return null;
        }

        if (optionConfig.hasOwnProperty(name)) {
          config = {};
          config[name] = optionConfig[name];
          return optionConfig[name];
        } else {
          return null;
        }
      }

      if (config.hasOwnProperty(name)) {
        return config[name];
      } else {
        if (optionConfig.hasOwnProperty(name)) {
          config[name] = optionConfig[name];
          return optionConfig[name];
        }
      }
      return null;
    },
    set: function(name, value) {
      if (!config) {
        config = {};
      }
      config[name] = value;
    }
  }
};