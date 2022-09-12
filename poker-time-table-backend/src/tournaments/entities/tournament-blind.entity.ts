import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'tournament_blind' })
export class TournamentBlind {
  @PrimaryColumn()
  id: number;

  @PrimaryColumn({ name: 'tournament_id' })
  tournamentId: number;

  @PrimaryColumn()
  level: number;

  @Column({ name: 'small_blind' })
  smallBlind: number;

  @Column({ name: 'big_blind' })
  bigBlind: number;

  @Column()
  minute: number;
}
