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
  smallBlind: number
  bigBlind: number

  chipsInPlay: string
  player: string
  averageStack: string
}
