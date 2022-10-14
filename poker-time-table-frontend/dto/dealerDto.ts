export interface DealerDto {
  id: number
  name: string
  tournament: string
  sitInTime: string
}

export interface GetDealersResponse {
  dealers: DealerDto[]
}

export interface RegisterDealerRequest {
  name: string
}

export interface RegisterDealerResponse {
  id: number
  name: string
  registerDate: Date
}

export interface UpdateDealerRequest {
  dealerId: number
  tournamentId: number
}

export interface UpdateDealerResponse {
  dealerId: number
  dealerName: string
  tournamentId: number
  tournamentTitle: string
  sitInTime: string
}

export interface GetDealerLogResponse {
  sitInTime: string
  sitOutTime: string
  dealerId: number
  playSeconds: number
  tournamentTitle: string
  dealerName: string
}
