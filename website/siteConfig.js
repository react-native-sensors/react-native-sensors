/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* List of projects/orgs using your project for the users page */
const users = [
  {
    caption: "react-native-live-translator",
    infoLink: "https://github.com/agrcrobles/react-native-live-translator",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/512px-React-icon.svg.png",
    pinned: true,
  },
  {
    caption: "imagination-react-native",
    infoLink: "https://github.com/Matzielab/imagination-react-native",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/512px-React-icon.svg.png",
    pinned: true,
  },
  {
    caption: "react-native-game-engine-handbook",
    infoLink: "https://github.com/bberak/react-native-game-engine-handbook",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/512px-React-icon.svg.png",
    pinned: true,
  },
  {
    caption: "react-native-iridescent",
    infoLink: "https://github.com/elevenfooteleven/react-native-iridescent",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/512px-React-icon.svg.png",
    pinned: true,
  },
];

const siteConfig = {
  title: "React Native Sensors",
  tagline: "Get your Accelerometer, Gyroscope, Magnetometer, and Barometer data the easy and reactive way",
  url: "https://react-native-sensors.github.io",
  baseUrl: "/" /* base url for your project */,
  projectName: "react-native-sensors.github.io",
  headerLinks: [
    { doc: "Installation", label: "Documentation" },
    {
      href: "https://github.com/react-native-sensors/react-native-sensors",
      label: "GitHub",
    },
  ],
  users,
  /* path to images for header/footer */
  headerIcon: "",
  footerIcon: "",
  favicon: "",
  /* colors for website */
  colors: {
    primaryColor: "#f6612c",
    secondaryColor: "#4BC6B9",
  },
  /* custom fonts for website */
  /*fonts: {
    myFont: [
      "Times New Roman",
      "Serif"
    ],
    myOtherFont: [
      "-apple-system",
      "system-ui"
    ]
  },*/
  // This copyright info is used in /core/Footer.js and blog rss/atom feeds.
  copyright: "Copyright © " + new Date().getFullYear() + " Daniel Schmidt",
  organizationName: "react-native-sensors", // or set an env variable ORGANIZATION_NAME
  projectName: "react-native-sensors.github.io", // or set an env variable PROJECT_NAME
  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks
    theme: "default",
  },
  scripts: ["https://buttons.github.io/buttons.js"],
  // You may provide arbitrary config keys to be used as needed by your template.
  repoUrl: "https://github.com/react-native-sensors/react-native-sensors",
  /* On page navigation for the current documentation page */
  // onPageNav: 'separate',
};

module.exports = siteConfig;
