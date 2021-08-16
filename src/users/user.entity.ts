import { Ticket } from 'src/tickets/ticket.entity';
import { UserRole } from './../user-role/userRole.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
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

  @Column({ nullable: true })
  verifyEmailCode: string;

  @Column({ nullable: true })
  forgotPasswordCode: string;

  @OneToMany(() => UserRole, (userRole) => userRole.user, {
    onDelete: 'CASCADE',
  })
  userRoles: UserRole[];

  @OneToMany(() => Rating, (rating) => rating.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  ratings: Rating[];

  @OneToMany(() => Transaction, (transaction) => transaction.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  transactions: Transaction[];

  @OneToMany(() => Ticket, (ticket) => ticket.holder, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  holdTickets: Ticket[];

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }

  async hashPassword() {
    this.salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, this.salt);
  }

  async updatePassword() {
    this.password = await bcrypt.hash(this.password, this.salt);
  }
}
