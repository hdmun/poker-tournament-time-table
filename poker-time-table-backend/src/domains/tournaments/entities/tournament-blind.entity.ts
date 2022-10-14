import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Tournament } from './tournament.entity';

@Entity({ name: 'tournament_blind' })
export class TournamentBlind {
  @PrimaryColumn({ name: 'tournament_id' })
  tournamentId: number;

  @PrimaryColumn()
  id: number;

  @Column()
  level: number;

  @Column({ name: 'ante' })
  ante: number;

  @Column({ name: 'small_blind' })
  smallBlind: number;

  @Column({ name: 'big_blind' })
  bigBlind: number;

  @Column()
  minute: number;

  @ManyToOne(() => Tournament, (tournament) => tournament.blinds, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'tournament_id', referencedColumnName: 'id' })
  tournament: Tournament;

  static create(
    tournamentId: number,
    id: number,
    level: number,
    ante: number,
    smallBlind: number,
    bigBlind: number,
    minute: number,
  ): TournamentBlind {
    const newBlind = new TournamentBlind();
    newBlind.tournamentId = tournamentId;
    newBlind.id = id;
    newBlind.level = level;
    newBlind.ante = ante;
    newBlind.smallBlind = smallBlind;
    newBlind.bigBlind = bigBlind;
    newBlind.minute = minute;
    return newBlind;
  }

  static createBreakTime(
    tournamentId: number,
    id: number,
    minute: number,
  ): TournamentBlind {
    const newBlind = new TournamentBlind();
    newBlind.tournamentId = tournamentId;
    newBlind.id = id;
    newBlind.level = -1;
    newBlind.ante = -1;
    newBlind.smallBlind = -1;
    newBlind.bigBlind = -1;
    newBlind.minute = minute;
    return newBlind;
  }
}
