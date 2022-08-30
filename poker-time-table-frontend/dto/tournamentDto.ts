export interface GetTournamentDto {
  title: string
  startDateTime: string
  buyIn: number
}

export interface RegisterTournamentDto {
  title: string
  startDateTime: Date
  buyIn: number
  blindStructureId: number
  breakTime: number
  breakTimeTerm: number
}
