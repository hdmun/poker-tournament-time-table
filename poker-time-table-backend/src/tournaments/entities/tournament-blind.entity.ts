import { Entity, Column, PrimaryColumn } from 'typeorm';

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
}
