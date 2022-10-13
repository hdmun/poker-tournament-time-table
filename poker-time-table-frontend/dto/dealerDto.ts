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
