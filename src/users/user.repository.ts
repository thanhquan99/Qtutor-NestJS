import { NotFoundException } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { User } from './user.entity';
import { EntityRepository, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(userDto: UserDto): Promise<User> {
    const user = User.create(userDto);
    await user.save();
    delete user.password;
    delete user.salt;
    return user;
  }

  async validateUserPassword(userDto: UserDto): Promise<User> {
    const { username, password } = userDto;

    const user = await this.findOne({ username });
    if (!user) {
      throw new NotFoundException('Your account is not exist');
    }

    if (user && (await user.validatePassword(password))) {
      return user;
    }
    return null;
  }
}
