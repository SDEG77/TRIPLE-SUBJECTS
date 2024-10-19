const Image = require("../models/Image");

module.exports = {
    async viewPhotos(clientId) {
        const images = await Image.find({ clientId: clientId });
        return images;
    }
}
