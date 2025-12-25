import { User } from 'src/users/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  price: number;

  @Column({ default: false })
  approved: boolean;

  @Column()
  lng: number;
  @Column()
  lat: number;
  @Column()
  year: number;
  @Column()
  mileage: number;
  @Column()
  make: string;
  @Column()
  model: string;

  @ManyToOne(() => User, (user) => user.reports, { eager: true })
  user: User;
}
