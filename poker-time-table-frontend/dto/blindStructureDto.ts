export interface BlindStructureTemplateDto {
  id: number
  name: string
}

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

export interface UpdateBlindStructureDto {
  id: number
  name: string
  structures: BlindStructureDto[]
}
