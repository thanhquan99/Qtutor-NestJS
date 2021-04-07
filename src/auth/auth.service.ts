import { RoleName } from './../roles/role.entity';
import { LoginUserDto } from './../users/dto/loginUser.dto';
import { User } from './../users/user.entity';
import { RegisterUserDto } from '../users/dto/registerUser.dto';
import { UserRepository } from './../users/user.repository';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/service/jwt/jwt-payload.interface';
import { getConnection } from 'typeorm';
import { Role } from 'src/roles/role.entity';
import { UserRole } from 'src/user-role/userRole.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async register(registerUserDto: RegisterUserDto) {
    if (await this.userRepository.findOne({ email: registerUserDto.email })) {
      throw new BadRequestException('Email is already exist');
    }

    let user;
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      // execute some operations on this transaction:
      user = queryRunner.manager.create(User, registerUserDto);
      await user.hashPassword();
      await user.save();
      const role = await queryRunner.manager.findOne(Role, {
        name: RoleName.CUSTOMER,
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
    return {
      user,
      message: 'Register success',
    };
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.userRepository.validateUserPassword(loginUserDto);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      email: user.email,
      roleName: user.userRole?.role?.name,
    };
    const accessToken = await this.jwtService.sign(payload);

    delete user.salt;
    delete user.password;
    return { accessToken, user };
  }
}
