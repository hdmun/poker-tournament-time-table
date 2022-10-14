import { Column, Entity, PrimaryColumn, RelationId } from 'typeorm';
import { Tournament } from '../../tournaments/entities/tournament.entity';

@Entity({ name: 'dealer_play_log' })
export class DealerPlayLog {
  @PrimaryColumn({ name: 'sit_in_time', nullable: false, primary: false })
  sitInTime: Date;

  @Column({ name: 'sit_out_time', nullable: false })
  sitOutTime: Date;

  @Column({ name: 'dealer_id' })
  dealerId: number;

  @Column({ name: 'tournament_id' })
  tournamentId: number;

  @Column({ name: 'play_seconds' })
  playSeconds: number;

  static Create(
    sitInTime: Date,
    sitOutTime: Date,
    dealerId: number,
    tournamentId: number,
  ): DealerPlayLog {
    const newWorkingLog = new DealerPlayLog();
    newWorkingLog.sitInTime = sitInTime;
    newWorkingLog.sitOutTime = sitOutTime;
    newWorkingLog.dealerId = dealerId;
    newWorkingLog.tournamentId = tournamentId;

    const playTimeMs = sitOutTime.getTime() - sitInTime.getTime();
    newWorkingLog.playSeconds = playTimeMs / 1000;
    return newWorkingLog;
  }
}
