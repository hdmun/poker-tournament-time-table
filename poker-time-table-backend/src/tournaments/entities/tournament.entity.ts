import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tournament' })
export class Tournament {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ name: 'start_datetime' })
  startDateTime: Date;

  @Column()
  buyIn: number;

  @Column({ name: 'blind_structure_id' })
  blindStructureId: number;

  @Column({ name: 'break_time' })
  breakTime: number;

  @Column({ name: 'break_time_term' })
  breakTimeTerm: number;

  static Create(
    title: string,
    startDateTime: Date,
    buyIn: number,
    blindStructureId: number,
    breakTime: number,
    breakTimeTerm: number,
  ) {
    const newTournament = new Tournament();
    newTournament.title = title;
    newTournament.startDateTime = startDateTime;
    newTournament.buyIn = buyIn;
    newTournament.blindStructureId = blindStructureId;
    newTournament.breakTime = breakTime;
    newTournament.breakTimeTerm = breakTimeTerm;

    return newTournament;
  }
}
