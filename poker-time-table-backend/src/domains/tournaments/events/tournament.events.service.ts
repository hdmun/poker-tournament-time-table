import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Subject } from 'rxjs';
import { TournamentClockEventDto } from '../dto/tournament';
import { TournamentBlind } from '../entities/tournament-blind.entity';
import { Tournament } from '../entities/tournament.entity';
import { TournamentBlindRepository } from '../tournament-blind.repository';
import { TournamentRepository } from '../tournament.repository';

@Injectable()
export class EventService {
  constructor(
    private readonly tournamentRepository: TournamentRepository,
    private readonly blindRepository: TournamentBlindRepository,
  ) {}

  private readonly logger = new Logger(EventService.name);

  public readonly subjects = new Subject<TournamentClockEventDto>();

  @Cron(CronExpression.EVERY_SECOND)
  async updateClock(): Promise<void> {
    const playingTournaments =
      await this.tournamentRepository.getPlayingTournaments();

    for (const tournament of playingTournaments) {
      const clock = await this.calcClock(tournament);
      if (clock !== null) {
        this.subjects.next(clock);
      }
    }
  }

  async calcClock(
    tournament: Tournament,
  ): Promise<TournamentClockEventDto | null> {
    const tournamentId = tournament.id;

    // todo: join 처리하자
    const blinds = await this.blindRepository.findBy({
      tournamentId,
    });
    if (blinds.length <= 0) {
      this.logger.error(`not exists blinds tournament ${tournamentId}`);
      return null;
    }

    if (blinds.length <= tournament.level) {
      // max blind level
      return null;
    }

    const currentBlind = blinds[tournament.level];
    const nowDate = new Date();

    const pauseTimeMs = calcPauseTimeMs(
      tournamentId,
      nowDate,
      tournament.pauseTime,
      this.logger,
    );

    const remainTime = calcReaminTime(
      tournamentId,
      nowDate,
      tournament.levelStart,
      currentBlind.minute,
      pauseTimeMs,
      tournament.pauseSeconds,
      this.logger,
    );

    let nextBreakRemainTime = '--:--';
    if (tournament.levelStart) {
      const nextBreakIdx = blinds.findIndex(
        (value, index) => tournament.level < index && value.level < 0,
      );
      if (nextBreakIdx > -1) {
        const nextBreakMinute = blinds
          .slice(tournament.level)
          .reduce<number>((accumulate, current, _index, array) => {
            if (current.level < 0) {
              array.splice(1);
              return accumulate;
            }

            return accumulate + current.minute;
          }, 0);

        nextBreakRemainTime = calcNextBreakTime(
          nowDate,
          tournament.levelStart,
          nextBreakMinute,
          pauseTimeMs,
          tournament.pauseSeconds,
        );
      }
    }

    const playTimeText = calcPlayTimeText(nowDate, tournament.startDateTime);
    const blind = getBlindValue(tournament, currentBlind, blinds);

    return {
      tournamentId,
      blindId: currentBlind.id,
      started: tournament.startDateTime !== null,
      playTime: playTimeText,
      nextBreakRemainTime,
      reaminHours: remainTime.hours,
      reaminMinutes: remainTime.minutes,
      reaminSeconds: remainTime.seconds,
      pause: tournament.startDateTime !== null && tournament.pauseTime !== null,
      level: currentBlind.level,
      ante: currentBlind.ante,
      smallBlind: blind[0],
      bigBlind: blind[1],
    };
  }

  @Cron(CronExpression.EVERY_SECOND)
  async updateTournamentBlindLevel(): Promise<void> {
    const playingTournaments =
      await this.tournamentRepository.getPlayingTournaments();

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

      const playTimeMinutes =
        (Math.floor(playTimeMs / 1000) - tournament.pauseSeconds) / 60;

      // 다음 레벨로 넘겨야 할지 체크
      const currentBlind = blinds[tournament.level];
      if (currentBlind.minute <= playTimeMinutes) {
        nowDate.setSeconds(nowDate.getSeconds() + 1);

        const clock = await this.calcClock(tournament);
        clock.blindId = tournament.level + 1;
        if (clock !== null) {
          this.subjects.next(clock);
        }

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
  }
}

function calcPlayTimeText(now: Date, start: Date): string {
  if (start) {
    const playTimeMs = now.getTime() - start.getTime();
    return convertMsToTimeString(playTimeMs);
  }
  return '00:00';
}

function calcNextBreakTime(
  now: Date,
  levelStart: Date,
  nextBreakMinute: number,
  pauseTimeMs: number,
  pauseSeconds: number,
): string {
  if (levelStart) {
    const nextBreakReamin = new Date(
      levelStart.getTime() +
        nextBreakMinute * 60 * 1000 +
        pauseTimeMs +
        pauseSeconds * 1000,
    );
    let nextBreawkRemainTimeMs = nextBreakReamin.getTime() - now.getTime();
    if (nextBreawkRemainTimeMs < 0) {
      nextBreawkRemainTimeMs = 0;
    }
    return convertMsToTimeString(nextBreawkRemainTimeMs);
  }

  return '--:--';
}

function calcPauseTimeMs(
  tournamentId: number,
  now: Date,
  pauseTime: Date,
  logger: Logger,
): number {
  let pauseTimeMs = 0;
  if (pauseTime) {
    pauseTimeMs = now.getTime() - pauseTime.getTime();
    if (pauseTimeMs < 0) {
      logger.error(
        `tournament pauseTime minus, tournamentId: ${tournamentId}, pauseTimeMs: ${pauseTimeMs}, nowDate: ${now} pauseTime: ${pauseTime}`,
      );
      pauseTimeMs = 0; // 로그 남기고 보정
    }
  }

  return pauseTimeMs;
}

function calcReaminTime(
  tournamentId: number,
  now: Date,
  levelStart: Date,
  blindMinute: number,
  pauseTimeMs: number,
  pauseSeconds: number,
  logger: Logger,
): TimeDto {
  if (levelStart) {
    const remainDate = new Date(
      levelStart.getTime() +
        blindMinute * 60 * 1000 +
        pauseTimeMs +
        pauseSeconds * 1000,
    );

    let reaminTimeMs = remainDate.getTime() - now.getTime();
    if (reaminTimeMs < 0) {
      // remainDate === nowDate 가 같아지면 밀리초 때문에 미세하게 음수 발생
      logger.error(
        `tournament reaminTimeMs minus, id: ${tournamentId}, levelStart: ${levelStart}, nowDate: ${now} remainDate: ${remainDate}`,
      );
      reaminTimeMs = 0;
    }
    return convertMsToTime(reaminTimeMs);
  }

  return {
    hours: '00',
    minutes: '00',
    seconds: '00',
  };
}

function getBlindValue(
  tournament: Tournament,
  currentBlind: TournamentBlind,
  blinds: TournamentBlind[],
): [number, number] {
  if (tournament.startDateTime) {
    if (currentBlind.level > 0) {
      return [currentBlind.smallBlind, currentBlind.bigBlind];
    } else {
      const prevBlind = blinds[tournament.level - 1];
      return [prevBlind.smallBlind, prevBlind.bigBlind];
    }
  }
  return [0, 0];
}

function padTo2Digits(num: number): string {
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

function convertMsToTimeString(milliseconds: number): string {
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
