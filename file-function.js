const path = require('path');

function isFileInLimit(file, limit) {
  return file.size <= limit;
}
async function uploadFile(file) {
  const filePath = path.resolve(__dirname, 'user_images', file.name);
  try {
    await file.mv(filePath);
  } catch (e) {
    console.error(e);
    throw e;
  }
}

module.exports = { uploadFile, isFileInLimit };
