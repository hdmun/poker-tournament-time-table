import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TournamentClockEventDto } from './dto/tournament';
import { TournamentBlindRepository } from './tournament-blind.repository';
import { TournamentRepository } from './tournament.repository';

@Injectable()
export class TournamentTimerService {
  constructor(
    private readonly tournamentRepository: TournamentRepository,
    private readonly blindRepository: TournamentBlindRepository,
  ) {}

  private readonly logger = new Logger(TournamentTimerService.name);

  async calcClock(tournamentId: number): Promise<TournamentClockEventDto> {
    const tournament = await this.tournamentRepository.findOneBy({
      id: tournamentId,
    });

    const blinds = await this.blindRepository.findBy({
      tournamentId: tournament.id,
    });

    const currentBlind = blinds[tournament.level];
    const nowDate = new Date();

    let remainTime = '00:00';
    let nextBreakRemainTime = '--:--';

    if (tournament.levelStart) {
      const remainDate = new Date(
        tournament.levelStart.getTime() +
          currentBlind.minute * 60 * 1000 +
          tournament.pauseSeconds * 1000,
      );
      remainTime = convertMsToTime(remainDate.getTime() - nowDate.getTime());

      const nextBreak = blinds.find(
        (value, index) => tournament.level < index && value.level < 0,
      );
      if (nextBreak) {
        const nextBreakMinute = blinds
          .slice(0)
          .reduce<number>((accumulate, current, index, array) => {
            if (currentBlind.id < index && current.level < 0) {
              array.splice(1);
              return accumulate;
            }

            if (index < currentBlind.id) {
              return accumulate;
            }

            return accumulate + current.minute;
          }, 0);

        const nextBreakReamin = new Date(
          tournament.levelStart.getTime() +
            nextBreakMinute * 60 * 1000 +
            tournament.pauseSeconds * 1000,
        );
        nextBreakRemainTime = convertMsToTime(
          nextBreakReamin.getTime() - nowDate.getTime(),
        );
      }
    }

    let playTimeText = '00:00';
    let smallBlind = 0;
    let bigBlind = 0;
    if (tournament.startDateTime) {
      const playTimeMs = nowDate.getTime() - tournament.startDateTime.getTime();
      const playTimeMinutes = playTimeMs;
      playTimeText = convertMsToTime(playTimeMinutes);

      if (currentBlind.level > 0) {
        smallBlind = currentBlind.smallBlind;
        bigBlind = currentBlind.bigBlind;
      } else {
        const prevBlind = blinds[tournament.level - 1];
        smallBlind = prevBlind.smallBlind;
        bigBlind = prevBlind.bigBlind;
      }
    }

    return {
      index: tournament.level,
      started: tournament.startDateTime !== null,
      playTime: playTimeText,
      nextBreakRemainTime,
      pause: tournament.pause,
      remainTime,
      level: currentBlind.level,
      smallBlind,
      bigBlind,
    };
  }

  @Cron(CronExpression.EVERY_SECOND)
  async updateClock() {
    const playingTournaments = await this.tournamentRepository
      .createQueryBuilder('tournament')
      .andWhere('tournament.start_datetime IS NOT NULL')
      .andWhere('tournament.level_start IS NOT NULL')
      .andWhere('tournament.end_datetime IS NULL')
      .getMany();

    for (const tournament of playingTournaments) {
      if (tournament.level < 0) {
        continue;
      }

      if (tournament.pause) {
        await this.tournamentRepository.update(
          { id: tournament.id },
          {
            pauseSeconds: () => 'pause_seconds + 1',
          },
        );
        continue;
      }

      const blinds = await this.blindRepository.findBy({
        tournamentId: tournament.id,
      });

      if (blinds.length <= tournament.level) {
        this.logger.error(
          `not enough blind level, ${tournament.level} / ${blinds.length}`,
        );
        continue;
      }

      const nowDate = new Date();
      const playTimeMs = nowDate.getTime() - tournament.levelStart.getTime();
      const playTimeMinutes =
        Math.floor(playTimeMs / 1000 / 60) - tournament.pauseSeconds * 60;

      // 다음 레벨로 넘겨야 할지 체크
      const currentBlind = blinds[tournament.level];
      if (currentBlind.minute <= playTimeMinutes) {
        tournament.level++;
        tournament.levelStart = nowDate;
        tournament.pauseSeconds = 0;

        await this.tournamentRepository.update(
          { id: tournament.id },
          {
            level: tournament.level,
            levelStart: tournament.levelStart,
            pauseSeconds: tournament.pauseSeconds,
          },
        );
      }
    }
  }
}

function padTo2Digits(num: number) {
  return num.toString().padStart(2, '0');
}

function convertMsToTime(milliseconds: number) {
  // https://bobbyhadz.com/blog/typescript-calculate-time-between-dates
  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  seconds = seconds % 60;
  minutes = minutes % 60;

  // 👇️ If you want to roll hours over, e.g. 00 to 24
  // 👇️ uncomment the line below
  // uncommenting next line gets you `00:00:00` instead of `24:00:00`
  // or `12:15:31` instead of `36:15:31`, etc.
  // 👇️ (roll hours over)
  // hours = hours % 24;
  if (hours === 0) {
    return `${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`;
  }

  return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}:${padTo2Digits(
    seconds,
  )}`;
}
