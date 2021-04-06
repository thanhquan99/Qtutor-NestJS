import { UserRole } from './../user-role/userRole.entity';
import { Role } from './../roles/role.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { User } from './user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { getManager, getRepository } from 'typeorm';
import { getConnection } from 'typeorm';
import * as bcrypt from 'bcrypt';
@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(userDto: UserDto) {
    let user;

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      // execute some operations on this transaction:
      user = queryRunner.manager.create(User, userDto);
      await user.hashPassword();
      await user.save();
      const role = await queryRunner.manager.findOne(Role, {
        name: 'Customer',
      });
      const userRole = await queryRunner.manager
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
    // const userId = await manager
    //   .transaction(async (manager) => {
    //     const user = await manager.create(User, userDto).save();
    //     const role = await manager.findOne(Role, { name: 'Customer1' });
    //     const userRole = await manager
    //       .create(UserRole, {
    //         user,
    //         role,
    //       })
    //       .save();
    //     return user.id;
    //   })
    //   .catch((err) => {
    //     throw new Error(err);
    //   });
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
