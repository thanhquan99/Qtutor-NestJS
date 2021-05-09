import { UserRole } from './../user-role/userRole.entity';
import {
  AfterInsert,
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Rating } from 'src/ratings/ratings.entity';
@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @Column({ default: false })
  isActive: boolean;

  @Column({ nullable: true })
  age: number;

  @OneToOne(() => UserRole, (userRole) => userRole.user, {
    cascade: true,
  })
  userRole: UserRole;

  @OneToMany(() => Rating, (rating) => rating.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  ratings: Rating[];

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }

  async hashPassword() {
    this.salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, this.salt);
  }

}
