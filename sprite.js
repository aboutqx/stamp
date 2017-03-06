var nsg = require('node-sprite-generator');
var vfs = require('vinyl-fs');
var converter = require('sass-convert');
//small-stamp-img1
//stamp-text-img
//stamp-text-img1
//icon-img
let imageName = "stamp-text-img1";

nsg({
    src: [
        'dist/'+imageName+'/*.png'
    ],
    spritePath: 'dist/img/'+imageName+'.png',
    stylesheetPath: 'src/scss/'+imageName+'.scss',
    stylesheet:'scss',
    stylesheetOptions:{

    },
    layout:'packed',
    compositor:'jimp'
}, function (err) {

 
// vfs.src('./src/css/*.+(sass|scss)')
//   .pipe(converter({
//     from: 'sass',
//     to: 'scss',
//   }))
//   .pipe(vfs.dest('./src/css'));
  console.log('Sprite generated!need compress');
});