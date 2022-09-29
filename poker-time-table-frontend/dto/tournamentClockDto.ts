export interface TournamentClockDto {
  tournamentId: number
  blindId: number
  started: boolean
  playTime: string
  nextBreakRemainTime: string
  remainHours: string
  remainMinutes: string
  remainSeconds: string
  pause: boolean
  level: number
  title: string
  ante: number
  smallBlind: number
  bigBlind: number

  chipsInPlay: string
  player: string
  averageStack: string
}

export function createTournamentClockDto(): TournamentClockDto {
  return {
    tournamentId: -1,
    blindId: -1,
    started: false,
    playTime: '00:00:00',
    nextBreakRemainTime: '00:00',
    remainHours: '00',
    remainMinutes: '00',
    remainSeconds: '00',
    pause: true,
    level: 0,
    title: '로딩 중...',
    ante: 0,
    smallBlind: 0,
    bigBlind: 0,
    chipsInPlay: '-',
    player: '-',
    averageStack: '-',
  }
}
