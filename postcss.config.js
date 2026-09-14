import postcssImport from "postcss-import";
import postcssPresetEnv from "postcss-preset-env";

export default {
  map: {inline: true},
  plugins: [
    postcssImport(),
    postcssPresetEnv()
  ],
};
