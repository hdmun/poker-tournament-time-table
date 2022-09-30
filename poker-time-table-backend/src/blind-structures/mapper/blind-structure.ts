import { BlindStructureDto } from '../dto/blind-structure';
import { BlindStructure } from '../entities/blind-structure.entity';

export function mapToBlindStructure(
  metaId: number,
  dto: BlindStructureDto,
): BlindStructure {
  return BlindStructure.create(
    metaId,
    dto.level,
    dto.ante,
    dto.smallBlind,
    dto.bigBlind,
    dto.minute,
  );
}
