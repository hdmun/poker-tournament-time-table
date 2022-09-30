import { Repository } from 'typeorm';
import { CustomRepository } from '~/typeorm-ex/typeorm-ex.decorator';
import { BlindStructureMeta } from './entities/blind-structure-meta.entity';

@CustomRepository(BlindStructureMeta)
export class BlindStructureMetaRepository extends Repository<BlindStructureMeta> {
  async getByMetaName(name: string): Promise<BlindStructureMeta> {
    return await this.findOneBy({ name });
  }
}
