import {IUser, UserStatus} from '@/interfaces/models/IUser';
import ISequelizeModels from '@/interfaces/models/ISequelizeModels';
import {UUID} from 'crypto';
import {Model, Sequelize, DataTypes} from 'sequelize';

/**
 * User
 */
export default class User extends Model implements IUser {
  /**
   * Note '!' is required in strict mode
   */
  public id!: UUID;
  public name!: string;
  public username!: string;
  public email!: string;
  public password!: string;
  public status!: UserStatus;
  public lastLogin!: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  /**
   * Initialize
   * @param {Sequelize} sequelize The sequelize object.
   * @return {void} Nothing
   */
  static initModel(sequelize: Sequelize): void {
    User.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4,
        },
        name: DataTypes.STRING,
        username: {
          type: DataTypes.STRING,
          unique: true,
        },
        email: {
          type: DataTypes.STRING,
          unique: true,
        },
        public: DataTypes.STRING,
        status: DataTypes.ENUM('ACTIVE', 'INACTIVE'),
        lastLogin: DataTypes.DATE,
      },
      {
        indexes: [{fields: ['id']}],
        sequelize,
        tableName: 'Users',
      }
    );
  }

  /**
   * Association
   * @param {Object.<string, ISequelizeModels>} models Models
   * @return {void} Nothing
   */
  static associateModel(models: ISequelizeModels): void {
    User.hasMany(models.Comment, {foreignKey: 'userId', as: 'comments'});
    User.hasMany(models.Post, {foreignKey: 'userId', as: 'posts'});
  }
}
