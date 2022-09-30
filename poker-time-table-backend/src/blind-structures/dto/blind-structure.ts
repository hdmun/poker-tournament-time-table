export interface BlindTemplateMetaResponse {
  id: number;
  name: string;
}

export interface BlindStructureDto {
  level: number;
  ante: number;
  smallBlind: number;
  bigBlind: number;
  minute: number;
}

export interface BlindStructureRegisterRequest {
  name: string;
  structures: BlindStructureDto[];
}

export interface BlindStructureUpdateRequest {
  id: number;
  name: string;
  structures: BlindStructureDto[];
}
