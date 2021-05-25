import {
  VerifyEmailDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ResendEmailDto,
} from './dto/index';
import { ROLE_NAME } from './../roles/role.entity';
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
import { v4 as uuid } from 'uuid';

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

    let id: string;
    try {
      await getManager().transaction(async (entityManager) => {
        const user = entityManager.create(User, registerUserDto);
        id = uuid();
        await user.hashPassword();
        user.verifyEmailCode = id;
        await entityManager.save(user);
        const role = await entityManager.findOne(Role, {
          name: ROLE_NAME.CUSTOMER,
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
        to: registerUserDto.email, // list of receivers
        subject: 'Verify your email address', // Subject line
        html: `<b>Your verify code is : ${id} </b>`, // HTML body content
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
    const user = await User.findOne({
      where: { email: verifyEmailDto.email },
    });
    if (!user) {
      throw new BadRequestException('User not existed');
    }
    if (!user.verifyEmailCode) {
      throw new BadRequestException(
        'Something went wrong! Please resend verify email again',
      );
    }
    if (user.verifyEmailCode !== verifyEmailDto.verifyEmailCode) {
      throw new BadRequestException('Wrong verify email code');
    }
    user.verifyEmailCode = null;
    await user.save();
    return {
      message: 'Verify email succesfullly !',
    };
  }

  async resendEmailRegister(resendEmailDto: ResendEmailDto) {
    const id = uuid();
    const user = await User.findOne({
      where: { email: resendEmailDto.email },
    });
    if (!user) {
      throw new BadRequestException('User not existed');
    }
    user.verifyEmailCode = id;
    await user.save();
    await this.mailerService
      .sendMail({
        to: resendEmailDto.email, // list of receivers
        subject: 'Verify your email address', // Subject line
        html: `<b>Your verify code is : ${id} </b>`, // HTML body content
      })
      .catch((err) => {
        console.log('Send mail failed due to ', err);
      });

    return {
      message: 'Resend verify email success !',
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const id = uuid();
    const user = await User.findOne({
      where: { email: forgotPasswordDto.email },
    });
    if (!user) {
      throw new BadRequestException('User not existed');
    }
    user.forgotPasswordCode = id;
    await user.save();
    await this.mailerService
      .sendMail({
        to: forgotPasswordDto.email, // list of receivers
        subject: 'Forgot password email', // Subject line
        html: `<b>Your verify code is : ${id} </b>`, // HTML body content
      })
      .catch((err) => {
        console.log('Send mail failed due to ', err);
      });

    return {
      message: 'Send email forgot password success !',
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await User.findOne({
      where: { email: resetPasswordDto.email },
    });
    if (!user) {
      throw new BadRequestException('User not existed');
    }
    if (!user.forgotPasswordCode) {
      throw new BadRequestException(
        'Something went wrong! Please resent forgot password email',
      );
    }
    if (user.forgotPasswordCode !== resetPasswordDto.resetPasswordCode) {
      throw new BadRequestException('Reset password code not correct');
    }
    user.password = resetPasswordDto.newPassword;
    await user.updatePassword();
    user.forgotPasswordCode = null;
    await user.save();
    return {
      message: 'Reset password success !',
    };
  }
}
