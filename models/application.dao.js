const { Collection, ObjectId } = require('mongodb');

class ApplicationDAO {
  /**
   * @type {Collection}
   */
  static #applications;

  static async initCollection(conn) {
    if (this.#applications) return;
    try {
      this.#applications = await conn
        .db(process.env.MONGO_DB)
        .collection('applications');
    } catch (e) {
      console.error(
        `Unable to establish collection handles in ApplicationDAO: ${e}`
      );
      throw e;
    }
  }
  /**
   * Get ID of Student Related to the Application with Application ID
   * @param  {string} application_id ObjectId in Hex Format, Will be converted to ObjectId for finding
   */
  static async getStudentId(application_id) {
    try {
      let result = await this.#applications
        .find({ _id: new ObjectId(application_id) })
        .project({ student_id: 1, _id: 0 });
      return (await result.next()).student_id.toHexString();
    } catch (e) {
      console.error(`Error Getting Student ID: ${e}`);
      throw e;
    }
  }
  static async saveApplication(application) {
    try {
      let result = await this.#applications.insertOne(application);
      return result.insertedId.toHexString();
    } catch (e) {
      console.error(`Error Saving Application: ${e}`);
      throw e;
    }
  }
  static async getApplications() {
    try {
      let applications = await this.#applications.aggregate([
        {
          $lookup: {
            from: 'students',
            localField: 'student_id',
            foreignField: '_id',
            as: 'student_details',
          },
        },
        {
          $unwind: {
            path: '$student_details',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            email: '$student_details.email',
            application_status: '$student_details.application_status',
          },
        },
        {
          $project: {
            student_details: 0,
          },
        },
      ]);
      return applications.toArray();
    } catch (e) {
      console.error(`Error getting applications: ${e}`);
      throw e;
    }
  }
  static async getApplication(application_id) {
    try {
      return await this.#applications.findOne({
        _id: new ObjectId(application_id),
      });
    } catch (e) {
      console.error(`Error getting application : ${e.message}`);
      throw e;
    }
  }
  static async getStudentApplication(student_id) {
    try {
      return await this.#applications.findOne({
        student_id: new ObjectId(student_id),
      });
    } catch (e) {
      console.error(`Error getting student application : ${e.message}`);
      throw e;
    }
  }
}
module.exports = ApplicationDAO;
