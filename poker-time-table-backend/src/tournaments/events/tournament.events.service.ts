import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Subject } from 'rxjs';
import { TournamentClockEventDto } from '../dto/tournament';
import { TournamentBlindRepository } from '../tournament-blind.repository';
import { TournamentRepository } from '../tournament.repository';

@Injectable()
export class EventService {
  constructor(
    private readonly tournamentRepository: TournamentRepository,
    private readonly blindRepository: TournamentBlindRepository,
  ) {}

  private readonly logger = new Logger(EventService.name);

  private subjects = new Map<number, Subject<TournamentClockEventDto>>();

  getClockObservable(tournamentId: number) {
    // if (!this.subjects.has(tournamentId)) { throw new Exception(''); }

    return this.subjects.get(tournamentId).asObservable();
  }

  @Cron(CronExpression.EVERY_SECOND)
  async updateClock() {
    console.time('updateClock');

    const playingTournaments = await this.tournamentRepository
      .createQueryBuilder('tournament')
      .andWhere('tournament.start_datetime IS NOT NULL')
      .andWhere('tournament.level_start IS NOT NULL')
      .andWhere('tournament.end_datetime IS NULL')
      .getMany();

    for (const tournament of playingTournaments) {
      const tournamentId = tournament.id;
      if (!this.subjects.has(tournamentId)) {
        this.subjects.set(tournamentId, new Subject<TournamentClockEventDto>());
      }

      const clockData = await this.calcClock(tournamentId);
      this.subjects.get(tournamentId).next(clockData);
    }
    console.timeEnd('updateClock');
  }

  private async calcClock(
    tournamentId: number,
  ): Promise<TournamentClockEventDto> {
    console.time('calcClock');
    const tournament = await this.tournamentRepository.findOneBy({
      id: tournamentId,
    });

    const blinds = await this.blindRepository.findBy({
      tournamentId: tournament.id,
    });

    const currentBlind = blinds[tournament.level];
    const nowDate = new Date();

    let remainTime: TimeDto = {
      hours: '00',
      minutes: '00',
      seconds: '00',
    };
    let nextBreakRemainTime = '--:--';

    if (tournament.levelStart) {
      let pauseTime = 0;
      if (tournament.pauseTime) {
        pauseTime = nowDate.getTime() - tournament.pauseTime.getTime();
      }

      if (pauseTime < 0) {
        this.logger.error(
          `tournament pauseTime minus, tournamentId: ${tournamentId}, pauseTime: ${pauseTime}, nowDate: ${nowDate} tournament.pauseTime: ${tournament.pauseTime}`,
        );
      }

      const remainDate = new Date(
        tournament.levelStart.getTime() +
          currentBlind.minute * 60 * 1000 +
          pauseTime +
          tournament.pauseSeconds * 1000,
      );

      let reaminTimeMs = remainDate.getTime() - nowDate.getTime();
      if (reaminTimeMs < 0) {
        // remainDate === nowDate 가 같아지면 밀리초 때문에 미세하게 음수 발생
        reaminTimeMs = 0;
      }
      remainTime = convertMsToTime(reaminTimeMs);

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
            pauseTime +
            tournament.pauseSeconds * 1000,
        );
        let nextBreawkRemainTimeMs =
          nextBreakReamin.getTime() - nowDate.getTime();
        if (nextBreawkRemainTimeMs < 0) {
          nextBreawkRemainTimeMs = 0;
        }
        nextBreakRemainTime = convertMsToTimeString(nextBreawkRemainTimeMs);
      }
    }

    let playTimeText = '00:00';
    let smallBlind = 0;
    let bigBlind = 0;
    if (tournament.startDateTime) {
      const playTimeMs = nowDate.getTime() - tournament.startDateTime.getTime();
      const playTimeMinutes = playTimeMs;
      playTimeText = convertMsToTimeString(playTimeMinutes);

      if (currentBlind.level > 0) {
        smallBlind = currentBlind.smallBlind;
        bigBlind = currentBlind.bigBlind;
      } else {
        const prevBlind = blinds[tournament.level - 1];
        smallBlind = prevBlind.smallBlind;
        bigBlind = prevBlind.bigBlind;
      }
    }
    console.timeEnd('calcClock');

    return {
      index: tournament.level,
      started: tournament.startDateTime !== null,
      playTime: playTimeText,
      nextBreakRemainTime,
      reaminHours: remainTime.hours,
      reaminMinutes: remainTime.minutes,
      reaminSeconds: remainTime.seconds,
      pause: tournament.startDateTime !== null && tournament.pauseTime !== null,
      level: currentBlind.level,
      smallBlind,
      bigBlind,
    };
  }

  @Cron(CronExpression.EVERY_SECOND)
  async updateTournamentBlindLevel() {
    console.time('updateTournamentBlindLevel');
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

      if (tournament.pauseTime) {
        continue;
      }

      const blinds = await this.blindRepository.findBy({
        tournamentId: tournament.id,
      });

      if (blinds.length === tournament.level) {
        continue;
      }

      if (blinds.length < tournament.level) {
        this.logger.error(
          `not enough blind level, ${tournament.level} / ${blinds.length}`,
        );
        continue;
      }

      const nowDate = new Date();
      const playTimeMs = nowDate.getTime() - tournament.levelStart.getTime();
      if (playTimeMs < 0) {
        this.logger.error(
          `tournament playTimeMs minus
          , tournamentId: ${tournament.id}
          , playTimeMs: ${playTimeMs}
          , nowDate: ${nowDate}
          , tournament.levelStart: ${tournament.levelStart}
          , tournament.pauseTime: ${tournament.pauseTime}`,
        );
      }

      let pauseTime = 0;
      if (tournament.pauseTime) {
        pauseTime = tournament.pauseTime.getTime() / 1000 / 60;
      }
      const playTimeMinutes =
        Math.floor(playTimeMs / 1000 / 60) -
        pauseTime -
        tournament.pauseSeconds * 1000;

      // 다음 레벨로 넘겨야 할지 체크
      const currentBlind = blinds[tournament.level];
      if (currentBlind.minute <= playTimeMinutes) {
        tournament.level++;
        tournament.levelStart = nowDate;
        tournament.pauseTime = null;

        await this.tournamentRepository.update(
          { id: tournament.id },
          {
            level: tournament.level,
            levelStart: tournament.levelStart,
            pauseTime: tournament.pauseTime,
            pauseSeconds: 0,
          },
        );
      }
    }
    console.timeEnd('updateTournamentBlindLevel');
  }
}

function padTo2Digits(num: number) {
  return num.toString().padStart(2, '0');
}

interface TimeDto {
  hours: string;
  minutes: string;
  seconds: string;
}

function convertMsToTime(milliseconds: number): TimeDto {
  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  seconds = seconds % 60;
  minutes = minutes % 60;

  return {
    hours: padTo2Digits(hours),
    minutes: padTo2Digits(minutes),
    seconds: padTo2Digits(seconds),
  };
}

function convertMsToTimeString(milliseconds: number) {
  // https://bobbyhadz.com/blog/typescript-calculate-time-between-dates
  const time = convertMsToTime(milliseconds);

  // 👇️ If you want to roll hours over, e.g. 00 to 24
  // 👇️ uncomment the line below
  // uncommenting next line gets you `00:00:00` instead of `24:00:00`
  // or `12:15:31` instead of `36:15:31`, etc.
  // 👇️ (roll hours over)
  // hours = hours % 24;
  if (time.hours === '00') {
    return `${time.minutes}:${time.seconds}`;
  }

  return `${time.hours}:${time.minutes}:${time.seconds}`;
}
