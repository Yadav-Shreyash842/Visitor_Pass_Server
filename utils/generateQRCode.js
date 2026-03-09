const QRCode = require ("qrcode");

const generateQRCode = async (data) => {
    try{
        const qrCodeImages = await QRCode.toDataURL(JSON.stringify(data));
        return qrCodeImages;
    } catch (error){
        throw new Error("Failed to generate QR code" + error.message);
    }
};

module.exports = {generateQRCode};