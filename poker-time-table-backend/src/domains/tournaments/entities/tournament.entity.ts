import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Dealer } from '../../dealer/entities/dealer.entity';
import { TournamentBlind } from './tournament-blind.entity';

@Entity({ name: 'tournament' })
export class Tournament {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ name: 'start_datetime', nullable: true })
  startDateTime: Date;

  @Column({ name: 'end_datetime', nullable: true })
  endDateTime: Date;

  @Column()
  buyIn: number;

  @Column({ name: 'level' })
  level: number;

  @Column({ name: 'late_reg_blind_id' })
  lateRegBlindId: number;

  @Column({ name: 'level_start', nullable: true })
  levelStart: Date;

  @Column({ name: 'pause_time', nullable: true })
  pauseTime: Date;

  @Column({ name: 'pause_seconds' })
  pauseSeconds: number;

  @OneToOne(() => Dealer, (dealer) => dealer, {
    nullable: true,
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'id', referencedColumnName: 'tournamentId' })
  dealer: Dealer;

  @OneToMany(() => TournamentBlind, (blinds) => blinds.tournament, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'id', referencedColumnName: 'tournament_id' })
  blinds: TournamentBlind[];

  static Create(
    title: string,
    buyIn: number,
    lateRegBlindId: number,
  ): Tournament {
    const newTournament = new Tournament();
    newTournament.title = title;
    newTournament.buyIn = buyIn;
    newTournament.level = -1;
    newTournament.lateRegBlindId = lateRegBlindId;
    newTournament.pauseSeconds = 0;
    return newTournament;
  }
}
