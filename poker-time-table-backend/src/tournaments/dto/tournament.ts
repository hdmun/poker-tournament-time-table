export interface TournamentDto {
  id: number;
  title: string;
  startDateTime: Date;
  endDateTime: Date;
  buyIn: number;
  level: number;
  levelStart: Date;
  pauseTime: Date;
  pauseSeconds: number;
}

export interface TournamentDetailDto {
  id: number;
  title: string;
  startDateTime: Date;
  endDateTime: Date;
  buyIn: number;
  blindId: number;

  structures: TournamentBlindDto[];
}

export interface TournamentBlindDto {
  level: number;
  ante: number;
  smallBlind: number;
  bigBlind: number;
  minute: number;
}

export interface TournamentRegisterRequest {
  title: string;
  buyIn: number;
  blindStructureId: number;
  breakTime: number;
  breakTimeTerm: number;
}

export interface TournamentRegisterResponse {
  tournament: TournamentDto;
  blinds: TournamentBlindDto[];
}

export interface TournamentCloseResponse {
  tournamentId: number;
  endDateTime: Date;
}

export interface TournamentClockEventDto {
  tournamentId: number;
  blindId: number;
  started: boolean;
  playTime: string;
  nextBreakRemainTime: string;
  reaminHours: string;
  reaminMinutes: string;
  reaminSeconds: string;
  pause: boolean;
  level: number;
  ante: number;
  smallBlind: number;
  bigBlind: number;
}
