import { Inject, Injectable } from "@tsed/di";
import { NotFound } from "@tsed/exceptions";
import { MongooseModel } from "@tsed/mongoose";
import { TaskModel } from "src/models/taskModel";
import { User } from "src/models/User";
import { UserCreation } from "src/models/UserCreation";

@Injectable()
export class UsersServices {
  @Inject(UserCreation) private readonly userCreationModel: MongooseModel<UserCreation>;
  @Inject(User) private readonly userModel: MongooseModel<User>;

  async createUser(user: UserCreation) {
    const newUser = new this.userCreationModel(user);

    console.log(`user: ${user.username} will be created`);

    return await newUser.save();
  }

  async findAll(): Promise<User[]> {
    const users = await this.userModel.find();
    console.table(users);
    return users;
  }

  async findOne(id: string): Promise<User | any> {
    const user = await this.userModel.findById(id);

    if (user) {
      return user;
    }

    throw new NotFound("User not found");
  }

  async updateUser(id: string, user: User) {
    return this.userModel.findByIdAndUpdate(id, user, { new: true, upsert: false });
  }

  async delete(id: string): Promise<void> {
    await this.findOne(id);
    await this.userModel.deleteOne({ _id: id });
  }

  //////////////////////////  tasks services

  async createTask(id: string, task: TaskModel) {
    const user = await this.userModel.findByIdAndUpdate({ _id: id }, { $addToSet: { tasks: task } }, { new: true, upsert: false });

    return user;
  }
  async updateTask(id: string, task: TaskModel) {
    return this.userModel.findByIdAndUpdate(id, {}, { new: true, upsert: false });
  }
}
