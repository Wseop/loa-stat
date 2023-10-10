import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  private readonly logger: Logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {
    setTimeout(() => {
      this.create({ email: 'email', name: 'name' });
    }, 1000 * 5);
  }

  async findOne(email: string): Promise<User> {
    return await this.userModel.findOne(
      { email },
      { _id: 0, createdAt: 0, updatedAt: 0 },
    );
  }

  async create(user: User): Promise<User> {
    const result = await this.userModel.create(user);
    return {
      email: result.email,
      name: result.name,
    };
  }

  async deleteOne(email: string): Promise<number> {
    return (await this.userModel.deleteOne({ email })).deletedCount;
  }
}
