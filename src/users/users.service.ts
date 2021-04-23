import { BaseServiceCRUD } from 'src/base/base-service-CRUD';
import { QueryParams } from 'src/base/dto/query-params.dto';
import { UserRoleView } from './../user-role/userRoleView.entity';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Role } from 'src/roles/role.entity';
import { UserRole } from 'src/user-role/userRole.entity';
import { getManager } from 'typeorm';

@Injectable()
export class UsersService extends BaseServiceCRUD<User> {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {
    super(userRepository, User, 'user');
  }

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

  async getUsers(query: QueryParams) {
    const builder = getManager()
      .getRepository(UserRoleView)
      .createQueryBuilder('user_role_view');
    return await this.queryBuilder(builder, query, 'user_role_view');
  }
}
