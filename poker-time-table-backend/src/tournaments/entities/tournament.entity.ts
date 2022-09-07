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

  @Column({ name: 'blind_level' })
  blindLevel: number;

  static Create(title: string, buyIn: number) {
    const newTournament = new Tournament();
    newTournament.title = title;
    newTournament.buyIn = buyIn;
    newTournament.blindLevel = 0;
    return newTournament;
  }
}
