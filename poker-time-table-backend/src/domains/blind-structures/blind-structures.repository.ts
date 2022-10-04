import { Repository } from 'typeorm';
import { CustomRepository } from '~/typeorm-ex/typeorm-ex.decorator';
import { BlindStructure } from './entities/blind-structure.entity';

@CustomRepository(BlindStructure)
export class BlindStructureRepository extends Repository<BlindStructure> {}
