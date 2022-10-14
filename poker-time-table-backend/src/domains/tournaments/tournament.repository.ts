import { IsNull, Repository } from 'typeorm';
import { CustomRepository } from '~/typeorm-ex/typeorm-ex.decorator';
import { Tournament } from './entities/tournament.entity';

@CustomRepository(Tournament)
export class TournamentRepository extends Repository<Tournament> {
  async getTitleById(tournamentId: number): Promise<string | undefined> {
    const result = await this.createQueryBuilder()
      .where({ id: tournamentId })
      .select('tournament.title')
      .getRawOne();
    return result?.title;
  }

  async getNonDealerTournaments(): Promise<Tournament[]> {
    const tournamentsWithDealer = await this.find({
      where: {
        endDateTime: IsNull(),
      },
      relations: ['dealer'],
    });

    return tournamentsWithDealer.filter((tournament) => {
      return !tournament.dealer;
    });
  }

  async getPlayingTournaments(): Promise<Tournament[]> {
    return this.createQueryBuilder('tournament')
      .andWhere('tournament.start_datetime IS NOT NULL')
      .andWhere('tournament.level_start IS NOT NULL')
      .andWhere('tournament.end_datetime IS NULL')
      .getMany();
  }
}
