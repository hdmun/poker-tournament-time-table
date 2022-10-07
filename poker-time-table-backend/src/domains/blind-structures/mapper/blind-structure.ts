import { BlindStructureDto } from '../dto/blind-structure';
import { BlindStructure } from '../entities/blind-structure.entity';

export function mapToBlindStructure(
  metaId: number,
  dto: BlindStructureDto,
): BlindStructure {
  return BlindStructure.create(
    metaId,
    dto.id,
    dto.level,
    dto.ante,
    dto.smallBlind,
    dto.bigBlind,
    dto.minute,
  );
}

export function mapFromBlindStructure(
  entity: BlindStructure,
): BlindStructureDto {
  return {
    id: entity.id,
    level: entity.level,
    ante: entity.ante,
    smallBlind: entity.smallBlind,
    bigBlind: entity.bigBlind,
    minute: entity.minute,
  };
}
