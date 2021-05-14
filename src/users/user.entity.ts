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
import { Transaction } from 'src/transactions/transactions.entity';
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

  @OneToMany(() => UserRole, (userRole) => userRole.user, {
    onDelete: 'CASCADE',
  })
  userRoles: UserRole[];

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

  @OneToMany(() => Transaction, (transaction) => transaction.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  transactions: Transaction[];
}
