const { Collection, ObjectId } = require('mongodb');

class AdminDAO {
  /**
   * @type {Collection}
   */
  static #admins;

  static async initCollection(conn) {
    if (this.#admins) return;
    try {
      this.#admins = await conn.db(process.env.MONGO_DB).collection('admins');
    } catch (e) {
      console.error(
        `Unable to establish collection handles in StudentDAO: ${e}`
      );
      throw e;
    }
  }

  static async getAdminWithEmail(email) {
    try {
      return await this.#admins.findOne({ email: email });
    } catch (e) {
      console.error('Error getting Admin: ' + e.message);
      throw e;
    }
  }
}
module.exports = AdminDAO;
