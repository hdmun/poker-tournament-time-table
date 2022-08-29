export interface BlindStructureDto {
  level: number
  smallBlind: number
  bigBlind: number
  minute: number
}

export interface RegisterBlindStructureDto {
  name: string
  structures: BlindStructureDto[]
}
