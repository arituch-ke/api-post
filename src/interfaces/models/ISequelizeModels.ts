import {ModelStatic, Model} from 'sequelize';
import {IUser} from './IUser';
import {IPost} from './IPost';
import {IComment} from './IComment';

export default interface ISequelizeModels {
  Post: ModelStatic<Model<IPost>>;
  User: ModelStatic<Model<IUser>>;
  Comment: ModelStatic<Model<IComment>>;
}
