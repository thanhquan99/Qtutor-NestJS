import { LoginUserDto } from './dto/loginUser.dto';
import { NotFoundException } from '@nestjs/common';
import { User } from './user.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async validateUserPassword(loginUserDto: LoginUserDto): Promise<User> {
    const { email, password } = loginUserDto;

    const user = await this.findOne({ email });
    if (!user) {
      throw new NotFoundException('Your account is not exist');
    }

    if (user && (await user.validatePassword(password))) {
      return user;
    }
    return null;
  }
}
