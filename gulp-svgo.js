const { Transform } = require('stream');
const { optimize } = require('svgo');

module.exports = options => new Transform({
  objectMode: true,
  transform(file, encoding, cb) {
    if (file.isBuffer()) {
      const result = optimize(String(file.contents), options).data;

      if (typeof result === 'string') {
        file.contents = Buffer.from(result);
      }
    }

    return cb(null, file);
  }
});
