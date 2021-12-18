import { ROLE, TutorStudentStatus } from 'src/constant';
import { SALT } from './../constant/index';
import { UpdateMeDto, CreateUserDto } from './dto/index';
import {
  Profile,
  Role,
  Student,
  Tutor,
  TutorStudent,
  User,
} from 'src/db/models';
import { BaseServiceCRUD } from 'src/base/base-service-CRUD';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService extends BaseServiceCRUD<User> {
  constructor() {
    super(User, 'User');
  }

  async getMe(id: string): Promise<User> {
    return await User.query().modify('defaultSelect').findById(id);
  }

  async updateMe(id: string, payload: UpdateMeDto): Promise<User> {
    await Profile.query().where({ userId: id }).update(payload);
    return await this.getMe(id);
  }

  async getUsers(
    query,
    adminId: string,
  ): Promise<{ results: User[]; total: number }> {
    const builder = User.queryBuilder(query)
      .modify('adminSelect')
      .whereNot({ id: adminId });
    return await this.paginate(builder, query);
  }

  async getMyNotification(id: string, query: any) {
    const student = await Student.query().findOne({ userId: id });
    const tutor = await Tutor.query().findOne({ userId: id });
    if (!tutor && !student) {
      return { total: 0, results: [] };
    }
    const builder = TutorStudent.queryBuilder(query)
      .modify('defaultSelect')
      .where((qb) => {
        if (student) {
          qb.orWhere({
            studentId: student.id,
            status: TutorStudentStatus.WAITING_STUDENT_ACCEPT,
          });
        }
        if (tutor) {
          qb.orWhere({
            tutorId: tutor.id,
            status: TutorStudentStatus.WAITING_TUTOR_ACCEPT,
          });
        }
      });

    const notifications = await this.paginate(builder, query);
  }

  async getOne(id: string): Promise<User> {
    const tutor = await User.query().modify('adminSelect').findById(id);
    if (!tutor) {
      throw new NotFoundException(`User not found`);
    }

    return tutor;
  }

  async createOne(payload: CreateUserDto) {
    const { email, isActive, name, password } = payload;
    const user = await User.query().findOne({ email: payload.email });
    if (user) {
      throw new BadRequestException('Email already exist');
    }

    const role = await Role.query().findOne({ name: ROLE.CUSTOMER });
    return await User.query()
      .modify('adminSelect')
      .insertGraphAndFetch({
        email,
        password: bcrypt.hashSync(password, SALT),
        isActive,
        profile: { name },
        roleId: role.id,
      });
  }
}
