import {
  Student,
  Tutor,
  Subject,
  TutorStudent,
  TutorRating,
} from 'src/db/models';
import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ROLE, SALT, TutorStudentStatus } from '../constant';
import { User } from '../db/models';
import { JwtPayload } from '../service/jwt/jwt-payload.interface';
import { SALoginDto, SAUpdateTutorDto } from './dto';
import { customFilterInTutors } from '../tutors/utils';
import { BaseServiceCRUD } from '../base/base-service-CRUD';
import { customFilterInStudents } from '../students/utils';
import { collaborativeFilter } from '../service/AI';
import { knex } from '../db/models/config';

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

  async updateOneTutor(
    tutorId: string,
    payload: SAUpdateTutorDto,
  ): Promise<Tutor> {
    const tutor = await Tutor.query().modify('defaultSelect').findById(tutorId);
    if (!tutor) {
      throw new NotFoundException('Tutor not found');
    }

    await tutor.$query().patch(payload);
    return tutor;
  }

  async updateOneStudent(
    studentId: string,
    payload: SAUpdateTutorDto,
  ): Promise<Student> {
    const student = await Student.query()
      .modify('defaultSelect')
      .findById(studentId);
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    await student.$query().patch(payload);
    return student;
  }

  async executeAI(): Promise<{ message: string }> {
    const ratings = await TutorRating.query().select('reviewerId', 'tutorId');
    const users = await User.query().whereIn(
      'id',
      TutorRating.query().select('reviewerId'),
    );
    const updateUsers = collaborativeFilter(users, ratings);

    const updateUserIdsString = `'${updateUsers
      .map((e) => e.userId)
      .join(`','`)}'`;
    const updateRecommendationTutorIdsString = `'${updateUsers
      .map((e) => `{${e.recommendationTutorIds}}`)
      .join(`','`)}'`;

    await knex.raw(`
      UPDATE users
      SET "recommendationTutorIds" = data_table.recommendation_tutor
      FROM
        (SELECT UNNEST(ARRAY[${updateUserIdsString}])::bigint as user_id, 
                UNNEST(ARRAY[${updateRecommendationTutorIdsString}])::bigint[] as recommendation_tutor) as data_table
      WHERE users."id" = data_table.user_id
    `);
    return { message: 'Success' };
  }
}
