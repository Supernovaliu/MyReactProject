const babelConfig = {
  presets: [
    
    "@babel/preset-typescript",
    ["@babel/preset-env", {
      useBuiltIns: "entry",
      corejs: 2
    }], "@babel/preset-react"
  ],
  plugins: ["@babel/plugin-syntax-dynamic-import", ["@babel/plugin-transform-runtime"]]
};

module.exports = babelConfig;