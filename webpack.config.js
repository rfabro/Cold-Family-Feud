module.exports = {
    module: {
      rules: [
        {
          test: /\.(png|jpe?g|gif|mp3)$/i,
          use: [
            {
              loader: 'file-loader',
            },
          ],
        },
      ],
    },
  };