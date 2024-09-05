module.exports = {
  name: 'addViewBox',
  fn: () => ({
    root: {
      enter: (node) => {
        const element = node?.children?.[0];

        if (!element) return;

        const { width, height, viewBox } = element.attributes;

        if (viewBox) return;

        if (!width || !height) return;

        element.attributes.viewBox = `0 0 ${width} ${height}`;
        delete element.attributes.width;
        delete element.attributes.height;
      },
    },
  }),
};
