import {IComment} from '@/interfaces/models/IComment';
import ISequelizeModels from '@/interfaces/models/ISequelizeModels';
import {UUID} from 'crypto';
import {Model, Sequelize, DataTypes} from 'sequelize';

/**
 * Comment
 */
export default class Comment extends Model implements IComment {
  /**
   * Note '!' is required in strict mode
   */
  public id!: UUID;
  public postId!: UUID;
  public userId!: UUID;
  public content!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  /**
   * Initialize
   * @param {Sequelize} sequelize The sequelize object.
   * @return {void} Nothing
   */
  static initModel(sequelize: Sequelize): void {
    Comment.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4,
        },
        postId: DataTypes.UUID,
        userId: DataTypes.UUID,
        content: DataTypes.STRING,
      },
      {
        indexes: [{fields: ['id']}, {fields: ['postId']}, {fields: ['userId']}],
        sequelize,
        tableName: 'Comments',
      }
    );
  }

  /**
   * Association
   * @param {Object.<string, ISequelizeModels>} models Models
   * @return {void} Nothing
   */
  static associateModel(models: ISequelizeModels): void {
    Comment.belongsTo(models.User, {foreignKey: 'userId', as: 'user'});
    Comment.belongsTo(models.Post, {foreignKey: 'postId', as: 'post'});
  }
}
