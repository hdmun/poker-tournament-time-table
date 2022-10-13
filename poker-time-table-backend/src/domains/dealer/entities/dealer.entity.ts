import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tournament } from '../../tournaments/entities/tournament.entity';

@Entity({ name: 'dealer' })
export class Dealer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'register_date' })
  registerDate: Date;

  @Column({ length: 12, unique: true })
  name: string;

  @Column({ name: 'tournament_id', default: 0 })
  tournamentId: number;

  @Column({ name: 'sit_in_time', nullable: true })
  sitInTime: Date;

  @OneToOne(() => Tournament, (tournament) => tournament, {
    nullable: true,
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'tournament_id', referencedColumnName: 'id' })
  tournament: Tournament;

  static Create(
    name: string,
    tournamentId: number,
    sitInTime: Date | null,
  ): Dealer {
    const newDealer = new Dealer();
    newDealer.registerDate = new Date();
    newDealer.name = name;
    newDealer.tournamentId = tournamentId;
    newDealer.sitInTime = sitInTime;
    return newDealer;
  }
}
