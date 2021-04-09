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
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      // execute some operations on this transaction:
      user = queryRunner.manager.create(User, createUserDto);
      await user.hashPassword();
      await user.save();
      const role = await queryRunner.manager.findOne(Role, {
        name: roleName,
      });
      await queryRunner.manager
        .create(UserRole, {
          user,
          role,
        })
        .save();
      // commit transaction now:
      await queryRunner.commitTransaction();
    } catch (err) {
      // since we have errors let's rollback changes we made
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(`Failed due to ${err}`);
    } finally {
      // you need to release query runner which is manually created:
      await queryRunner.release();
    }
    return user;
  }

  async getUsers() {
    const manager = getManager();
    return await manager.find(UserRoleView);
  }
}
