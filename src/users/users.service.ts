import { AdminUpdateUserDto } from './dto/admin-update-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BaseServiceCRUD } from 'src/base/base-service-CRUD';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from 'src/roles/role.entity';
import { UserRole } from 'src/user-role/userRole.entity';
import { getManager } from 'typeorm';
import * as bcrypt from 'bcrypt';

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

    return await getManager()
      .transaction(async (entityManager) => {
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
        delete user.password;
        delete user.salt;
        return user;
      })
      .catch((err) => {
        console.log('Failed due to ', err);
      });
  }

  getMe(user: User): User {
    delete user.password;
    delete user.salt;

    return user;
  }

  async updateMe(id: number, updateDto: UpdateUserDto): Promise<User> {
    const user = await User.findOne(id);
    for (const property in updateDto) {
      user[property] = updateDto[property];
    }
    if (updateDto.password) {
      await user.updatePassword();
    }
    await user.save();

    delete user.password;
    delete user.salt;
    return user;
  }

  async adminUpdateUser(
    updateDto: AdminUpdateUserDto,
    userId: number,
  ): Promise<User> {
    const { isActive, roleName } = updateDto;
    const user = await User.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await getManager().transaction(async (entityManager) => {
      if (isActive) {
        user.isActive = isActive;
        await entityManager.save(user);
      }

      if (roleName) {
        const role = await Role.findOne({ where: { name: roleName } });
        const userRole = await UserRole.findOne({ where: { user: user } });
        userRole.role = role;
        await entityManager.save(userRole);
      }
    });

    return await User.findOne({
      where: { id: userId },
      relations: ['userRoles', 'userRoles.role'],
    });
  }
}
