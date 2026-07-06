import type { Options } from "tsup";
import { defineConfig } from "tsup";
import replace from "unplugin-replace/esbuild";
import pkg from "./package.json" assert { type: "json" };

export default function tsupConfig({
	entry = ["src/index.ts"],
	external = [],
	noExternal = [],
	target = "esnext",
	skipNodeModulesBundle = true,
	splitting = false,
	esbuildPlugins = [],
	treeshake = false,
}: Options = {}) {
	return defineConfig({
		entry,
		external,
		noExternal,
		platform: "node",
		format: ["esm", "cjs"],
		skipNodeModulesBundle,
		target,
		clean: true,
		minify: false,
		terserOptions: {
			keep_classnames: true,
			keep_fnames: true,
			mangle: false,
		},
		splitting,
		keepNames: true,
		dts: true,
		sourcemap: true,
		esbuildPlugins: [
			...esbuildPlugins,
			replace({
				values: {
					"{{package_version}}": pkg.version,
				},
			}),
		],
		treeshake,
		outDir: "dist",
	});
}
