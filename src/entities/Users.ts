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

  @Column({
    type: 'json',
    default: () => "'[]'",
  })
  followers!: { username: string }[];

  toResponseObject() {
    const { username, followers } = this;
    return { username, followers };
  }
}
