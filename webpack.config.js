 module.exports = {
     entry: {
         Router: './app/components/Router.jsx'
     },
     output: {
         path: __dirname + '/client/js',
         filename: '[name]-bundle.js',
     },
     module: {
         loaders: [
            { test: /.jsx?$/, loader: "babel-loader", exclude: /node_modules/,
            query: {
                presets: ['es2015', 'react']
            }}
        ]
     }
 }