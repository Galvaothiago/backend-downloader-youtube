const convertFormat = (format) => {
    let codeFormat = ''

    switch (format) {
        case '360p':
          codeFormat = '18';
          break;

        case '480p':
            codeFormat = '135';
            break;

        case '720p':
          codeFormat = '136';
          break

        case '1080p':
            codeFormat = '137'
            
        default:
          codeFormat = '136';
    }

    return codeFormat

}

module.exports = {convertFormat}