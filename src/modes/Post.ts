import {IPost, PostStatus} from '@/interfaces/models/IPost';
import ISequelizeModels from '@/interfaces/models/ISequelizeModels';
import {UUID} from 'crypto';
import {Model, Sequelize, DataTypes} from 'sequelize';

/**
 * Post
 */
export default class Post extends Model implements IPost {
  /**
   * Note '!' is required in strict mode
   */
  public id!: UUID;
  public userId!: UUID;
  public title!: string;
  public content!: string;
  public cover!: string;
  public status!: PostStatus;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  /**
   * Initialize
   * @param {Sequelize} sequelize The sequelize object.
   * @return {void} Nothing
   */
  static initModel(sequelize: Sequelize): void {
    Post.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4,
        },
        userId: DataTypes.UUID,
        title: DataTypes.STRING,
        content: DataTypes.STRING,
        public: DataTypes.STRING,
        cover: DataTypes.STRING,
        status: DataTypes.ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED'),
      },
      {
        indexes: [{fields: ['id']}, {fields: ['userId']}],
        sequelize,
        tableName: 'Posts',
      }
    );
  }

  /**
   * Association
   * @param {Object.<string, ISequelizeModels>} models Models
   * @return {void} Nothing
   */
  static associateModel(models: ISequelizeModels): void {
    Post.belongsTo(models.User, {foreignKey: 'userId', as: 'user'});
    Post.hasMany(models.Comment, {foreignKey: 'postId', as: 'comments'});
    Post.belongsToMany(models.Tag, {
      through: models.PostTagMapping,
      as: 'tags',
      foreignKey: 'postId',
      otherKey: 'tagId',
    });
  }
}
