import { UserDto } from './dto/user.dto';
import { User } from './user.entity';
import { EntityRepository, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(userDto: UserDto): Promise<User> {
    const user = User.create(userDto);
    await user.save();
    return user;
  }

  async validateUserPassword(userDto: UserDto): Promise<User> {
    const { username, password } = userDto;

    const user = await this.findOne({ username });
    console.log(user);
    console.log(await user.validatePassword(password));
    if (user && (await user.validatePassword(password))) {
      return user;
    }
    return null;
  }
}
