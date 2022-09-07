export interface TournamentBlindDto {
  level: number
  smallBlind: number
  bigBlind: number
  minute: number
}

export interface RegisterTournamentDto {
  title: string
  buyIn: number
  blindStructureId: number
  breakTime: number
  breakTimeTerm: number
}

export interface TournamentDetailDto {
  id: number
  title: string
  startDateTime: Date
  endDateTime: Date
  buyIn: number

  structures: TournamentBlindDto[]
}
