import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { User } from './users/entity/user.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { WishesModule } from './wishes/wishes.module';
import { Wish } from './wishes/entity/wish.entity';
import { WishlistsModule } from './wishlists/wishlists.module';
import { Wishlist } from './wishlists/entity/wishlist.entity';
import { OffersModule } from './offers/offers.module';
import { Offer } from './offers/entity/offer.entity';
import configuration from 'configuration';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration], isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      database: 'kupipodariday',
      username: 'student',
      password: 'student',
      entities: [User, Wish, Wishlist, Offer],
      synchronize: true,
      schema: 'public',
    }),
    UsersModule,
    AuthModule,
    WishesModule,
    WishlistsModule,
    OffersModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
