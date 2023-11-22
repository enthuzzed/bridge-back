import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ICPTransactionEntity } from '@app/entitie';

@Injectable()
export class IcpTransactionDAOService {
  constructor(
    @InjectRepository(ICPTransactionEntity)
    private repository: Repository<ICPTransactionEntity>,
  ) {}

  async find(options) {
    return this.repository.findAndCount(options);
  }

  async findOne(options) {
    return this.repository.findOne(options);
  }

  async insert(data) {
    return this.repository.insert(data);
  }

  async upsert(data) {
    return this.repository.upsert(data, ['id']);
  }

  async save(data) {
    return this.repository.save(data);
  }

  async update(filter, data) {
    return this.repository.update(filter, data);
  }

  async delete(filter) {
    return this.repository.delete(filter);
  }
}
