export interface TournamentClockDto {
  playTime: string
  nextBreakTime: string
  remainTime: string
  pause: boolean
  level: number
  title: string
  smallBlind: number
  bigBlind: number
  chipsInPlay: number
  player: number
  totalPlayer: number
  averageStack: number
}
