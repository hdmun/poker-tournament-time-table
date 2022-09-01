import { BlindStructureDto } from './blindStructureDto'

export interface GetTournamentDto {
  id: number
  title: string
  startDateTime: string
  buyIn: number
}

export interface TournamentDetailDto {
  id: number
  title: string
  startDateTime: Date
  buyIn: number
  blindStructureId: number
  breakTime: number
  breakTimeTerm: number

  structures: BlindStructureDto[]
}

export interface RegisterTournamentDto {
  title: string
  startDateTime: Date
  buyIn: number
  blindStructureId: number
  breakTime: number
  breakTimeTerm: number
}
