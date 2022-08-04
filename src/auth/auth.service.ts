import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signUp(dto: AuthDto) {
    // generating hashed password
    const hash = await argon.hash(dto.password);

    //save new user in db
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
        // selecting what should be returned
        // select: {
        //   email: true,
        //   firstname: true,
        //   lastname: true,
        // },
      });
      // delete hash
      delete user.hash;

      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email is already taken');
        }
      }
      throw error;
    }
  }
  // signIn -user provides email and password
  async signIn(dto: AuthDto) {
    // find the user by email
    // findFirst
    // findUnique
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    //if user doesn't exist throw exception
    if (!user) {
      throw new ForbiddenException('Credentials incorrect');
    }
    // compare password
    const passwordMatch = await argon.verify(user.hash, dto.password);
    // if password is incorrect throw exception
    if (!passwordMatch) {
      throw new ForbiddenException('Password incorrect');
    }

    return this.signToken(user.id, user.email);
  }
  // creation of access token
  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET_KEY');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: secret,
    });

    return {
      access_token: token,
    };
  }
}
