export interface TournamentBlindDto {
  level: number
  ante: number
  smallBlind: number
  bigBlind: number
  minute: number
}

export interface TournamentRegisterRequest {
  title: string
  buyIn: number
  lateRegBlindId: number
  blindStructureId: number
}

export interface TournamentDetailDto {
  id: number
  title: string
  startDateTime: Date
  endDateTime: Date
  buyIn: number
  blindId: number

  structures: TournamentBlindDto[]
}

export interface TournamentLogDto {
  title: string
  startDateTime: Date
  endDateTime: Date
}

export interface GetSitInTournamentResponse {
  id: number
  title: string
}

export interface TournamentClockEventDto {
  tournamentId: number
  blindId: number
  started: boolean
  playTime: string
  nextBreakRemainTime: string
  lateRegReaminTime: string
  reaminHours: string
  reaminMinutes: string
  reaminSeconds: string
  pause: boolean
  level: number
  ante: number
  smallBlind: number
  bigBlind: number
}
