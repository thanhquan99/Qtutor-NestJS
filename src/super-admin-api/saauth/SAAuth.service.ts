import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../../db/models';
import { SALoginDto } from './dto';
import * as bcrypt from 'bcrypt';
import { ROLE, SALT } from '../../constant';
import { JwtPayload } from '../../service/jwt/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class SAAuthService {
  constructor(private jwtService: JwtService) {}

  async login(body: SALoginDto): Promise<{ user: User; accessToken: string }> {
    const { email, password } = body;
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

    if (user.role?.name !== ROLE.SUPER_ADMIN) {
      throw new UnauthorizedException('Wrong email or password');
    }

    const payload: JwtPayload = {
      email: user.email,
      roleName: user.role?.name,
    };
    const accessToken = this.jwtService.sign(payload);
    delete user.password;
    return { accessToken, user };
  }
}
