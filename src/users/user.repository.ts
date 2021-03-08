import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = User.create(createUserDto);
    await user.save();
    return user;
  }
}
