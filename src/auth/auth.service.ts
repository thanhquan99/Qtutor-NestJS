import {
  VerifyEmailDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from './dto/index';
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
import { getManager } from 'typeorm';
import { Role } from 'src/roles/role.entity';
import { UserRole } from 'src/user-role/userRole.entity';
import { UserRoleView } from 'src/user-role/userRoleView.entity';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  async register(registerUserDto: RegisterUserDto) {
    if (await this.userRepository.findOne({ email: registerUserDto.email })) {
      throw new BadRequestException('Email is already exist');
    }

    try {
      await getManager().transaction(async (entityManager) => {
        const user = entityManager.create(User, registerUserDto);
        await user.hashPassword();
        await entityManager.save(user);

        const role = await entityManager.findOne(Role, {
          name: RoleName.CUSTOMER,
        });
        const userRole = entityManager.create(UserRole, {
          user,
          role,
        });
        await entityManager.save(userRole);
      });
    } catch (err) {
      throw new BadRequestException(`Failed due to ${err}`);
    }

    await this.mailerService
      .sendMail({
        to: 'thanhquan050399@gmail.com', // list of receivers
        subject: 'Testing Nest MailerModule ✔', // Subject line
        html: '<b>welcome</b>', // HTML body content
      })
      .catch((err) => {
        console.log('Send mail failed due to ', err);
      });

    return {
      message: 'Register success. Please verify your email',
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

    return { accessToken, user, roleName: role.name };
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    return {};
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    return {};
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    return {};
  }
}
