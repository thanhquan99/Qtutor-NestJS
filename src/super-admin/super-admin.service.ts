import { Student, Tutor, Subject } from 'src/db/models';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ROLE, SALT } from '../constant';
import { User } from '../db/models';
import { JwtPayload } from '../service/jwt/jwt-payload.interface';
import { SALoginDto } from './dto';

@Injectable()
export class SuperAdminService {
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

  async getDashboard(): Promise<{
    totalUsers: string;
    totalStudents: string;
    totalTutors: string;
    totalSubjects: string;
  }> {
    const [
      { count: totalUsers },
      { count: totalStudents },
      { count: totalTutors },
      { count: totalSubjects },
    ] = await Promise.all([
      User.query().count('id').first(),
      Student.query().count('id').first(),
      Tutor.query().count('id').first(),
      Subject.query().count('id').first(),
    ]);

    return {
      totalStudents,
      totalTutors,
      totalUsers,
      totalSubjects,
    };
  }
}
