import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({ name: 'level_start', nullable: true })
  levelStart: Date;

  @Column({ name: 'pause_time', nullable: true })
  pauseTime: Date;

  @Column({ name: 'pause_seconds' })
  pauseSeconds: number;

  static Create(title: string, buyIn: number): Tournament {
    const newTournament = new Tournament();
    newTournament.title = title;
    newTournament.buyIn = buyIn;
    newTournament.level = -1;
    newTournament.pauseSeconds = 0;
    return newTournament;
  }
}