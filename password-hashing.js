const bcrypt = require('bcrypt');
let saltRounds = 10;
async function generatePasswordHash(password) {
  try {
    let hash = await bcrypt.hash(password, saltRounds);
    return hash;
  } catch (e) {
    console.error(`Error Generating Hashed Password ${e}`);
    throw e;
  }
}
async function comparePassword(password, hash) {
  try {
    return await bcrypt.compare(password, hash);
  } catch (e) {
    console.error(`Error Comparing Password ${e}`);
    throw e;
  }
}

module.exports = {
  generatePasswordHash,
  comparePassword,
};
