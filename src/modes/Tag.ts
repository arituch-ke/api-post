import {ITag} from '@/interfaces/models/ITag';
import ISequelizeModels from '@/interfaces/models/ISequelizeModels';
import {UUID} from 'crypto';
import {Model, Sequelize, DataTypes} from 'sequelize';

/**
 * Tag
 */
export default class Tag extends Model implements ITag {
  /**
   * Note '!' is required in strict mode
   */
  public id!: UUID;
  public name!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  /**
   * Initialize
   * @param {Sequelize} sequelize The sequelize object.
   * @return {void} Nothing
   */
  static initModel(sequelize: Sequelize): void {
    Tag.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4,
        },
        name: DataTypes.STRING,
      },
      {
        indexes: [{fields: ['id']}],
        sequelize,
        tableName: 'Tags',
      }
    );
  }

  /**
   * Association
   * @param {Object.<string, ISequelizeModels>} models Models
   * @return {void} Nothing
   */
  static associateModel(models: ISequelizeModels): void {
    Tag.belongsToMany(models.Post, {
      through: models.PostTagMapping,
      as: 'posts',
      foreignKey: 'tagId',
      otherKey: 'postId',
    });
  }
}
