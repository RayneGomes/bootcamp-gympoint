import Sequelize from 'sequelize';
import databaseConfig from '../config/database';

import Checkin from '../app/models/Chekin';
import Enrolled from '../app/models/Enrolled';
import Plan from '../app/models/Plan';
import Student from '../app/models/Student';
import User from '../app/models/User';

const models = [Checkin, Enrolled, Plan, Student, User];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
