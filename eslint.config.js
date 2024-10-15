// eslint.config.js
import babelParser from "@babel/eslint-parser";
import hooksPlugin from "eslint-plugin-react-hooks";

export default [
  {
    plugins: {
      "react-hooks": hooksPlugin
    },
    files: ["src/**/*.jsx"],
    rules: {
      semi: "error",
      "prefer-const": "error",
      "require-await": "off",
      "no-duplicate-imports": "error",
      "no-unneeded-ternary": "error",
      "prefer-object-spread": "error",
      "eqeqeq": "error",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        "requireConfigFile": false,
        "babelOptions": {
          "presets": ["@babel/preset-react"]
        },
      }
    }
  }
];