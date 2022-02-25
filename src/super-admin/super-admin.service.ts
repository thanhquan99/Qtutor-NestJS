import { Student, Tutor, Subject, TutorStudent } from 'src/db/models';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ROLE, SALT, TutorStudentStatus } from '../constant';
import { User } from '../db/models';
import { JwtPayload } from '../service/jwt/jwt-payload.interface';
import { SALoginDto } from './dto';
import { customFilterInTutors } from '../tutors/utils';
import { BaseServiceCRUD } from '../base/base-service-CRUD';
import { customFilterInStudents } from '../students/utils';

@Injectable()
export class SuperAdminService extends BaseServiceCRUD<Tutor> {
  constructor(private jwtService: JwtService) {
    super(Tutor, 'Tutor');
  }

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
    totalCourses: string;
  }> {
    const [
      { count: totalUsers },
      { count: totalStudents },
      { count: totalTutors },
      { count: totalSubjects },
      { count: totalCourses },
    ] = await Promise.all([
      User.query().count('id').first(),
      Student.query().count('id').first(),
      Tutor.query().count('id').first(),
      Subject.query().count('id').first(),
      TutorStudent.query()
        .where({ status: TutorStudentStatus.ACCEPTED })
        .count('id')
        .first(),
    ]);

    return {
      totalStudents,
      totalTutors,
      totalUsers,
      totalSubjects,
      totalCourses,
    };
  }

  async getTutors(query): Promise<{ results: Tutor[]; total: number }> {
    const builder = Tutor.queryBuilder<Tutor>(query).modify('defaultSelect');

    customFilterInTutors(builder, query.customFilter);
    return await this.paginate(builder, query);
  }

  async getStudents(query): Promise<{ results: Student[]; total }> {
    const builder =
      Student.queryBuilder<Student>(query).modify('defaultSelect');

    customFilterInStudents(builder, query.customFilter);
    return await this.paginate(builder, query);
  }
}
