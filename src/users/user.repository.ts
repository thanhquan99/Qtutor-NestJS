import { LoginUserDto } from './dto/loginUser.dto';
import { UserRole } from './../user-role/userRole.entity';
import { Role } from './../roles/role.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { RegisterUserDto } from './dto/registerUser.dto';
import { User } from './user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { getConnection } from 'typeorm';
import * as bcrypt from 'bcrypt';
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
