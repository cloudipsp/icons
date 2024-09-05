const { Transform } = require('stream');
const { optimize } = require('svgo');

module.exports = function (options) {
  const stream = new Transform({ objectMode: true });
  stream._transform = function (file, encoding, cb) {
    if (file.isBuffer()) {
      const result = optimize(String(file.contents), options).data;

      if (typeof result === 'string') {
        file.contents = Buffer.from(result);
      }
    }

    return cb(null, file);
  };

  return stream;
};
