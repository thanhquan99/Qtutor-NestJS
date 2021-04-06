import { User } from './user.entity';
import { UserDto } from './dto/user.dto';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async createUser(userDto: UserDto) {
    const { username } = userDto;
    if (await this.userRepository.findOne({ username })) {
      throw new BadRequestException('User is already exist');
    }
    return this.userRepository.createUser(userDto);
  }

  async getManyUsers() {
    return this.userRepository.findOne(1);
  }
}
