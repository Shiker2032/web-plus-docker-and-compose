import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConflictException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { In, Repository } from 'typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';

import { Wish } from './entity/wish.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish) private wishRepo: Repository<Wish>,
    private usersService: UsersService,
  ) {}

  async createWish(createWishDto: CreateWishDto, username: string) {
    const user = await this.usersService.findUserByUsername(username);
    const wish = this.wishRepo.create(createWishDto);
    wish.owner = user;
    return this.wishRepo.save(wish);
  }

  async findLastWish() {
    return this.wishRepo.find({ order: { createdAt: 'desc' }, take: 40 });
  }

  async findTopWish() {
    return this.wishRepo.find({ order: { copied: 'desc' }, take: 10 });
  }

  async findWishById(id: number, relations = null) {
    const wish = this.wishRepo.findOne({ where: { id }, relations });
    if (!wish) {
      throw new NotFoundException('Такого подарка не существует');
    }
    return wish;
  }

  async deleteById(id: number, currentUser) {
    const wish = await this.findWishById(id);

    if (wish.owner !== currentUser.id) {
      throw new ForbiddenException('Вы не можете удалить чужой подарок');
    }
    return this.wishRepo.delete({ id });
  }

  async findManyById(idArr: any) {
    const wishes = await this.wishRepo.find({
      where: { id: In(idArr) },
    });
    return wishes;
  }

  async copyWish(id: number, currentUser) {
    const wish = await this.findWishById(id, ['owner']);
    const wishCopy = {
      name: wish.name,
      image: wish.image,
      link: wish.link,
      price: wish.price,
      description: wish.description,
    };
    const hasWish = await this.wishRepo.find({
      where: {
        name: wish.name,
        link: wish.link,
        price: wish.price,
        owner: { id: currentUser.id },
      },
    });

    if (hasWish.length) {
      throw new ConflictException('Вы уже добавили себе этот подарок');
    }

    await this.createWish(wishCopy, currentUser.username);
    return this.wishRepo.update(id, {
      copied: wish.copied + 1,
    });
  }

  async updateWishById(
    userId: number,
    id: number,
    updateWishDto: UpdateWishDto,
  ) {
    const wish = await this.findWishById(id, ['owner']);
    if (userId !== wish.owner.id) {
      throw new ForbiddenException('Вы не можете изменить чужой подарок');
    }
    if (wish.raised !== 0) {
      throw new ConflictException(
        'Вы не можете изменить стоимость подарка, если уже есть желающие его поддержать',
      );
    }
    return await this.wishRepo.update(id, updateWishDto);
  }

  async updateRaisedWishById(id: number, updateWishDto: UpdateWishDto) {
    return await this.wishRepo.update(id, updateWishDto);
  }
}
