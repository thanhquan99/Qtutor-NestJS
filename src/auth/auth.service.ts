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
import { getConnection, getManager } from 'typeorm';
import { Role } from 'src/roles/role.entity';
import { UserRole } from 'src/user-role/userRole.entity';
import { UserRoleView } from 'src/user-role/userRoleView.entity';

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

    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      await getManager().transaction(async (entityManager) => {
        const user = entityManager.create(User, registerUserDto);
        await user.hashPassword();
        await entityManager.save(user);

        const role = await entityManager.findOne(Role, {
          id: 12,
          name: RoleName.CUSTOMER,
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

    return {
      message: 'Register success',
    };
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.userRepository.validateUserPassword(loginUserDto);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { role } = await getManager().findOne(UserRoleView, {
      email: user.email,
    });

    const payload: JwtPayload = {
      email: user.email,
      roleName: role.name,
    };
    const accessToken = await this.jwtService.sign(payload);

    delete user.salt;
    delete user.password;
    return { accessToken, user };
  }
}
