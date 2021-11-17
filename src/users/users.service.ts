import { UpdateMeDto } from './dto/index';
import { Profile, User } from 'src/db/models';
import { BaseServiceCRUD } from 'src/base/base-service-CRUD';
import { Injectable } from '@nestjs/common';

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
}
