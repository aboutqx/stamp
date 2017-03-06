const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const imageminGifsicle = require('imagemin-gifsicle');

imagemin(['dist/distImg/*.{jpg,png,gif}'], 'dist/compressed-images', {
    plugins: [
        imageminMozjpeg(),
        imageminPngquant({quality: '65-80'}),
        imageminGifsicle({optimizationLevel:3})
    ]
}).then(files => {
    console.log(files);
    //=> [{data: <Buffer 89 50 4e …>, path: 'build/images/foo.jpg'}, …]
});