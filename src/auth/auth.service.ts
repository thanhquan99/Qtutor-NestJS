import { SALT, DEFAULT_EMAIL } from './../constant/index';
import {
  VerifyEmailDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ResendEmailDto,
  RegisterUserDto,
  LoginUserDto,
} from './dto/index';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/service/jwt/jwt-payload.interface';
import { MailerService } from '@nestjs-modules/mailer';
import { v4 as uuid } from 'uuid';
import { Role, User } from 'src/db/models';
import * as bcrypt from 'bcrypt';
import { ROLE } from 'src/constant';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  async register(registerUserDto: RegisterUserDto) {
    const { email, password } = registerUserDto;
    const user = await User.query().findOne({ email });
    if (user) {
      throw new BadRequestException('Email is already exist');
    }

    const role = await Role.query().findOne({ name: ROLE.CUSTOMER });
    const verifyEmailCode = uuid();
    await User.query().insertGraphAndFetch({
      email,
      password: bcrypt.hashSync(password, SALT),
      roleId: role.id,
      verifyEmailCode,
      profile: {
        name: registerUserDto.name,
        academicLevel: registerUserDto.academicLevel,
        cityId: registerUserDto.cityId,
        isMale: registerUserDto.isMale,
        avatar: registerUserDto.avatar,
      },
    });

    await this.mailerService.sendMail({
      to: DEFAULT_EMAIL || registerUserDto.email, // list of receivers
      subject: 'Verify your email', // Subject line
      html: `<b>Your verify code is : ${verifyEmailCode} </b>`, // HTML body content
    });

    return {
      message: 'Register success. Please verify your email',
    };
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    const { email, verifyEmailCode } = verifyEmailDto;
    const user = await User.query().findOne({ email });
    if (!user) {
      throw new BadRequestException('Unregistered email');
    }

    if (!user.verifyEmailCode) {
      throw new BadRequestException(
        'Something went wrong! Please resend verify email again',
      );
    }

    if (user.verifyEmailCode !== verifyEmailCode) {
      throw new BadRequestException('Wrong verify email code');
    }

    await user.$query().update({ verifyEmailCode: null, isActive: true });
    return {
      message: 'Verify email successfully!',
    };
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await User.query()
      .findOne({ email })
      .modify('selectInLogin')
      .withGraphFetched('role');
    if (!user) {
      throw new UnauthorizedException('Wrong email or password');
    }

    if (user.password !== bcrypt.hashSync(password, SALT)) {
      throw new UnauthorizedException('Wrong email or password');
    }

    if (!user.isActive) {
      throw new BadRequestException('Verify your email');
    }

    const payload: JwtPayload = {
      email: user.email,
      roleName: user.role?.name,
    };
    const accessToken = this.jwtService.sign(payload);
    delete user.password;
    return { accessToken, user };
  }

  async resendEmailRegister(resendEmailDto: ResendEmailDto) {
    // const id = uuid();
    // const user = await User.findOne({
    //   where: { email: resendEmailDto.email },
    // });
    // if (!user) {
    //   throw new BadRequestException('User not existed');
    // }
    // user.verifyEmailCode = id;
    // await user.save();
    // await this.mailerService
    //   .sendMail({
    //     to: resendEmailDto.email, // list of receivers
    //     subject: 'Verify your email address', // Subject line
    //     html: `<b>Your verify code is : ${id} </b>`, // HTML body content
    //   })
    //   .catch((err) => {
    //     console.log('Send mail failed due to ', err);
    //   });

    return {
      message: 'Resend verify email success !',
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    // const id = uuid();
    // const user = await User.findOne({
    //   where: { email: forgotPasswordDto.email },
    // });
    // if (!user) {
    //   throw new BadRequestException('User not existed');
    // }
    // user.forgotPasswordCode = id;
    // await user.save();
    // await this.mailerService
    //   .sendMail({
    //     to: forgotPasswordDto.email, // list of receivers
    //     subject: 'Forgot password email', // Subject line
    //     html: `<b>Your verify code is : ${id} </b>`, // HTML body content
    //   })
    //   .catch((err) => {
    //     console.log('Send mail failed due to ', err);
    //   });

    return {
      message: 'Send email forgot password success !',
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    // const user = await User.findOne({
    //   where: { email: resetPasswordDto.email },
    // });
    // if (!user) {
    //   throw new BadRequestException('User not existed');
    // }
    // if (!user.forgotPasswordCode) {
    //   throw new BadRequestException(
    //     'Something went wrong! Please resent forgot password email',
    //   );
    // }
    // if (user.forgotPasswordCode !== resetPasswordDto.resetPasswordCode) {
    //   throw new BadRequestException('Reset password code not correct');
    // }
    // user.password = resetPasswordDto.newPassword;
    // await user.updatePassword();
    // user.forgotPasswordCode = null;
    // await user.save();
    return {
      message: 'Reset password success !',
    };
  }
}
