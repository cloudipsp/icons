const {Transform} = require('stream');
const Vinyl = require('vinyl');
const sharp = require('sharp');

module.exports = options => new Transform({
    objectMode: true,
    transform(file, encoding, cb) {
        sharp(file.contents)
            .resize(options)
            .png()
            .toBuffer()
            .then((buffer) => cb(null, new Vinyl({
                cwd: file.cwd,
                base: file.base,
                path: file.path.replace(/\.svg$/, '.png'),
                contents: buffer,
            })))
            .catch((err) => cb(null, file));
    }
});
