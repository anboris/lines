import autoprefixer from "autoprefixer";
import postcssImport from "postcss-import";

export default {
  map: {inline: true},
  plugins: [postcssImport(), autoprefixer()],
};
