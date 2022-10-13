export interface DealerDto {
  id: number;
  name: string;
  tournament?: string;
  sitInTime?: string;
}

export interface GetDealersResponse {
  dealers: DealerDto[];
}

export interface RegisterDealerRequest {
  name: string;
}

export interface GetDealerLogResponse {
  dealerId: number;
  tournamentId: number;
  sitInTime: Date;
  sitOutTime: Date;
  playSeconds: number;
}

export interface RegisterDealerResponse extends DealerDto {}

export interface UpdateDealerRequest {
  dealerId: number;
  tournamentId: number;
}

export interface UpdateDealerResultDto {
  dealerId: number;
  dealerName: string;
  tournamentId: number;
  tournamentTitle: string;
  sitInTime: Date;
}

export interface UpdateDealerResponse {
  dealerId: number;
  dealerName: string;
  tournamentId: number;
  tournamentTitle: string;
  sitInTime: string;
}
