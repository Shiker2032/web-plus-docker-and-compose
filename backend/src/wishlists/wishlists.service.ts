import { Injectable } from '@nestjs/common';
import {
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entity/user.entity';
import { UsersService } from 'src/users/users.service';
import { WishesService } from 'src/wishes/wishes.service';
import { Repository } from 'typeorm';
import { CreateWishListDto } from './dto/create-wishlist.dto';
import { Wishlist } from './entity/wishlist.entity';

@Injectable()
export class WishlistsService {
  constructor(
    private readonly wishesService: WishesService,
    private readonly usersService: UsersService,
    @InjectRepository(Wishlist) private wishlistsRepo: Repository<Wishlist>,
  ) {}

  async findAllWishlists() {
    return this.wishlistsRepo.find({ relations: ['owner', 'items'] });
  }

  async findWishlistById(id: number) {
    const wishlist = await this.wishlistsRepo.findOne({
      where: { id },
      relations: ['owner', 'items'],
    });
    if (!wishlist) {
      throw new NotFoundException('Такого списка желаний не существует');
    }
    return wishlist;
  }

  async createWishlist(createWishListDto: CreateWishListDto, currentUser) {
    const { itemsId, ...collectionData } = createWishListDto;
    const wishes = await this.wishesService.findManyById(itemsId);
    const user = await this.usersService.findUserById(currentUser.id);

    return await this.wishlistsRepo.save({
      ...collectionData,
      owner: user,
      items: wishes,
    });
  }

  async deleteWishlistById(id: number, currentUser: User) {
    const wishlist = await this.findWishlistById(id);

    if (wishlist.owner.id !== currentUser.id) {
      throw new ForbiddenException('Вы не можете удалить чужую коллекцию');
    }
    return this.wishlistsRepo.delete(id);
  }
}
