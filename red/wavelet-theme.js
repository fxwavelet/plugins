module.exports = {
  page: {
    title: "Wavelet Editor",
    favicon: __dirname + "/public/images/favicon-32x32.png",
    css: __dirname + "/public/css/wavelet.css"
  },
  header: {
    title: "Wavelet Editor",
    image: __dirname + "/public/images/wavelet-36.png", // or null to remove image
    url: "http://fxwavelet.com" // optional url to make the header text/image a link to this url
  },

  deployButton: {
    type:"simple",
    label:"Save",
    icon: null// or null to remove image
  },

  menu: { // Hide unwanted menu items by id. see editor/js/main.js:loadEditor for complete list
    "menu-item-import-library": true,
    "menu-item-export-library": true,
    "menu-item-keyboard-shortcuts": true,
    "menu-item-help": {
      label: "Wavelet Help Page",
      url: "http://fxwavelet.com"
    }
  },

  userMenu: true, // Hide the user-menu even if adminAuth is enabled

  login: {
    image: __dirname + "/public/images/wavelet-192.png" // a 256x256 image
  }
};