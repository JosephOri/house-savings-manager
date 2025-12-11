import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractCrudService, User } from '@app/common';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { AddUserToHouseholdDto } from '../dto/add-user-to-household.dto';

@Injectable()
export class UsersService extends AbstractCrudService<User> {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {
    super(usersRepository);
  }

  private async validateCreateUserDto(createUserDto: CreateUserDto) {
    const user = await this.usersRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });
    if (user) {
      throw new UnprocessableEntityException(
        'User with this email already exists',
      );
    }
  }

  async create(createUserDto: CreateUserDto) {
    await this.validateCreateUserDto(createUserDto);
    return await super.create({
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    });
  }
  async findByEmailWithPassword(email: string) {
    const user = await this.usersRepository.findOne({
      select: {
        password: true,
      },
      where: {
        email: email,
      },
    });
    if (!user) {
      return null;
    }
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.usersRepository.findOneBy({ email });
    if (!user) {
      return null;
    }
    return user;
  }

  async addUserToHousehold(
    addUserToHouseholdDto: AddUserToHouseholdDto,
    user: User,
  ) {
    const userToAdd = await this.findByEmail(addUserToHouseholdDto.email);
    if (!userToAdd) {
      throw new UnprocessableEntityException(
        'User with this email does not exist',
      );
    }
    const adminDocument = await this.usersRepository.findOneBy({
      id: user.id,
    });
    if (!adminDocument) {
      throw new UnprocessableEntityException('User does not exist');
    }
    if (!adminDocument.householdId) {
      throw new BadRequestException('admin is not an admin of a household');
    }
    userToAdd.householdId = adminDocument.householdId;
    return await this.usersRepository.save(userToAdd);
  }
}
