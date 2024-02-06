import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity()
@Unique(['username'])
export class Users {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  username!: string;

  @Column()
  password!: string;

  @Column({ default: 0 })
  followers!: number;

  toResponseObject() {
    const { id, username, followers } = this;
    return { id, username, followers };
  }
}
