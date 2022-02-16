import typescript from "@rollup/plugin-typescript"
import { terser } from "rollup-plugin-terser"
import resolve from "rollup-plugin-node-resolve"
import dts from "rollup-plugin-dts"
import postcss from "rollup-plugin-postcss"
import { liveServer } from "rollup-plugin-live-server"

const build = () => [
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/testillery.js",
        format: "es",
      },
    ],
    plugins: [
      postcss(),
      typescript({ tsconfig: "./tsconfig.json" }),
      resolve(),
      terser(),
    ],
  },
  {
    input: "./dist/dts/index.d.ts",
    external: [/\.css$/],
    output: [{ file: "dist/testillery.d.ts", format: "es" }],
    plugins: [dts()],
  },
]

const dev = () => ({
  input: "src/index.ts",
  output: [
    {
      file: "dist/testillery.js",
      format: "es",
      sourcemap: true,
    },
  ],
  plugins: [
    postcss(),
    typescript({ tsconfig: "./tsconfig.json" }),
    resolve(),
    liveServer(),
  ],
})

export default process.env.ROLLUP_WATCH == "true" ? dev() : build()
