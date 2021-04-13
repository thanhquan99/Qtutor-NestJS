import { UserRoleView } from './../user-role/userRoleView.entity';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from './user.entity';
import { RegisterUserDto } from './dto/registerUser.dto';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { getConnection } from 'typeorm';
import { Role } from 'src/roles/role.entity';
import { UserRole } from 'src/user-role/userRole.entity';
import { getManager, getRepository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const { email, roleName } = createUserDto;
    if (await this.userRepository.findOne({ email })) {
      throw new BadRequestException('Email is already exist');
    }

    let user;
    try {
      await getManager().transaction(async (entityManager) => {
        const user = entityManager.create(User, createUserDto);
        await user.hashPassword();
        await entityManager.save(user);

        const role = await entityManager.findOne(Role, {
          name: roleName,
        });

        await entityManager
          .create(UserRole, {
            user,
            role,
          })
          .save();
      });
    } catch (err) {
      throw new BadRequestException(`Failed due to ${err}`);
    }

    return user;
  }

  async getUsers() {
    const manager = getManager();
    return await manager.find(UserRoleView);
  }
}
