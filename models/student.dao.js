const { Collection, ObjectId } = require('mongodb');

class StudentDAO {
  /**
   * @type {Collection}
   */
  static #students;

  static async initCollection(conn) {
    if (this.#students) return;
    try {
      this.#students = await conn
        .db(process.env.MONGO_DB)
        .collection('students');
    } catch (e) {
      console.error(
        `Unable to establish collection handles in StudentDAO: ${e}`
      );
      throw e;
    }
  }
  /**
   * Function to update the status of Application having application_id
   * @param  {string} student_id ObjectId in Hex Format, Will be converted to ObjectId
   * @param  {"submitted" | "not submitted" | "approved" | "rejected"} status New Status of Application
   */
  static async updateApplicationStatus(student_id, status) {
    try {
      let result = await this.#students.updateOne(
        { _id: new ObjectId(student_id) },
        { $set: { application_status: status } }
      );
      return result.modifiedCount;
    } catch (e) {
      console.error(`Error Updating Application Status: ${e}`);
      throw e;
    }
  }
  static async addStudent(student) {
    try {
      let result = await this.#students.insertOne({
        email: student.email,
        password: student.password,
        isVerified: false,
        application_status: 'not submitted',
        createdAt: new Date(),
      });
      return result.insertedId.toHexString();
    } catch (e) {
      console.error('Error adding Student: ' + e.message);
      throw e;
    }
  }
  static async getStudentWithEmail(email) {
    try {
      return await this.#students.findOne({ email: email });
    } catch (e) {
      console.error('Error getting Student: ' + e.message);
      throw e;
    }
  }
  static async getStudentWithId(id) {
    try {
      return await this.#students.findOne({ _id: new ObjectId(id) });
    } catch (e) {
      console.error('Error getting Student: ' + e.message);
      throw e;
    }
  }
  static async verifyStudent(student_id) {
    try {
      let result = await this.#students.updateOne(
        { _id: new ObjectId(student_id) },
        { $set: { isVerified: true } }
      );
      return result.modifiedCount;
    } catch (e) {
      throw e;
    }
  }
}
module.exports = StudentDAO;
