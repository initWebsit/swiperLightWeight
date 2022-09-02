import babel from 'rollup-plugin-babel'

export default {
    // 入口文件
    input: './bin/index.js',
    // 编译后输出文件
    output: {
        file: './lib/index.js',
        format: 'cjs',
    },
    plugins: [babel()],
    // extract: 'css/index.css', css抽离
    external: ['react']
}