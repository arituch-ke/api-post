import {IPostTagMapping} from '@/interfaces/models/IPostTagMapping';
import ISequelizeModels from '@/interfaces/models/ISequelizeModels';
import {UUID} from 'crypto';
import {Model, Sequelize, DataTypes} from 'sequelize';

/**
 * PostTagMapping
 */
export default class PostTagMapping extends Model implements IPostTagMapping {
  /**
   * Note '!' is required in strict mode
   */
  public postId!: UUID;
  public tagId!: UUID;

  /**
   * Initialize
   * @param {Sequelize} sequelize The sequelize object.
   * @return {void} Nothing
   */
  static initModel(sequelize: Sequelize): void {
    PostTagMapping.init(
      {
        postId: {
          type: DataTypes.UUID,
          primaryKey: true,
        },
        tagId: {
          type: DataTypes.UUID,
          primaryKey: true,
        },
      },
      {
        indexes: [{fields: ['postId']}, {fields: ['tagId']}],
        sequelize,
        tableName: 'PostTagMappings',
      }
    );
  }

  /**
   * Association
   * @param {Object.<string, ISequelizeModels>} models Models
   * @return {void} Nothing
   */
  static associateModel(models: ISequelizeModels): void {
    PostTagMapping.belongsTo(models.Post, {foreignKey: 'postId', as: 'post'});
    PostTagMapping.belongsTo(models.Tag, {foreignKey: 'tagId', as: 'tag'});
  }
}
