import { Test, TestingModule } from '@nestjs/testing';
import { BlindStructureMetaRepository } from './blind-structure-meta.repository';
import { BlindStructureRepository } from './blind-structure.repository';
import { TournamentService } from './tournament.service';

describe('TournamentService', () => {
  let service: TournamentService;
  let blindStructureMetaRepo: BlindStructureMetaRepository;
  let blindStructureRepo: BlindStructureRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TournamentService,
        BlindStructureMetaRepository,
        BlindStructureRepository,
      ],
    }).compile();

    service = module.get<TournamentService>(TournamentService);
    blindStructureMetaRepo = module.get<BlindStructureMetaRepository>(
      BlindStructureMetaRepository,
    );
    blindStructureRepo = module.get<BlindStructureRepository>(
      BlindStructureRepository,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
