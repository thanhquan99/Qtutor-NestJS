import { User } from './../users/user.entity';
import { UserDto } from '../users/dto/user.dto';
import { UserRepository } from './../users/user.repository';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/service/jwt/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(userDto: UserDto): Promise<User> {
    const { username } = userDto;
    if (await this.userRepository.findOne({ username })) {
      throw new BadRequestException('User is already exist');
    }
    return this.userRepository.createUser(userDto);
  }

  async signIn(
    userDto: UserDto,
  ): Promise<{ accessToken: string; username: string }> {
    const user = await this.userRepository.validateUserPassword(userDto);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = { username: user.username };
    const accessToken = await this.jwtService.sign(payload);

    return { accessToken, username: user.username };
  }
}
