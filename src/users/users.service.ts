import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { BaseServiceCRUD } from 'src/base/base-service-CRUD';
import { ROLE } from 'src/constant';
import { Notification, Profile, Role, User } from 'src/db/models';
import { SALT } from './../constant/index';
import { CreateUserDto, UpdateMeDto } from './dto/index';

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

  async getMyNotification(userId: string, query: any) {
    const builder = Notification.queryBuilder(query)
      .modify('defaultSelect')
      .where({ userId });
    return await this.paginate(builder, query);
  }

  async getMyNotificationSummary(userId: string): Promise<{
    total: string;
    totalUnread: string;
  }> {
    const [{ count: total }, { count: totalUnread }] = await Promise.all([
      Notification.query().where({ userId }).count().first(),
      Notification.query().where({ userId, isRead: false }).count().first(),
    ]);
    return { total, totalUnread };
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
