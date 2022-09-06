import { BlindStructureDto } from './blind-structure';

export interface RegisterTournamentDto {
  title: string;
  startDateTime: Date;
  buyIn: number;
  blindStructureId: number;
  breakTime: number;
  breakTimeTerm: number;
}

export interface TournamentDetailDto {
  id: number;
  title: string;
  startDateTime: Date;
  buyIn: number;
  breakTime: number;
  breakTimeTerm: number;

  structures: BlindStructureDto[];
}
