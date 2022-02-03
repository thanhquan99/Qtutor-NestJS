import { MailerService } from '@nestjs-modules/mailer';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { BaseServiceCRUD } from 'src/base/base-service-CRUD';
import { ROLE, TransactionStatus } from 'src/constant';
import {
  Profile,
  Role,
  Tutor,
  User,
  TutorStudent,
  Transaction,
} from 'src/db/models';
import paypalService from '../service/paypal';
import { SALT, TutorStudentStatus } from './../constant/index';
import { CreateUserDto, UpdateMeDto } from './dto/index';

@Injectable()
export class UsersService extends BaseServiceCRUD<User> {
  constructor(private readonly mailerService: MailerService) {
    super(User, 'User');
  }

  async getMe(id: string): Promise<User> {
    const user = await User.query().modify('selectInGetMe').findById(id);
    if (user.isTutor) {
      const tutorBuilder = Tutor.query()
        .select('id')
        .findOne({ userId: user.id });
      user.teachings = await TutorStudent.query()
        .modify('selectInGetTeaching')
        .where('tutorId', '=', tutorBuilder)
        .andWhere({ status: TutorStudentStatus.ACCEPTED });
    }

    return user;
  }

  async updateMe(id: string, payload: UpdateMeDto): Promise<User> {
    const { paypalEmail } = payload;
    delete payload.paypalEmail;

    await Profile.query().where({ userId: id }).update(payload);

    //Payout
    if (paypalEmail) {
      await User.query().where({ id }).update({ paypalEmail });
      const transactions = await Transaction.query()
        .modify('defaultSelect')
        .where({
          tutorUserId: id,
          status: TransactionStatus.PENDING,
        });
      if (transactions?.length) {
        await paypalService.createPayout(
          transactions,
          paypalEmail,
          this.mailerService,
        );
      }
    }

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
