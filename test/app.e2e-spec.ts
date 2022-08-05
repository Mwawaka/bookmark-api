import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../src/prisma/prisma.service';
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum';
import { AuthDto } from 'src/auth/dto';

describe('App e2e', () => {
  let app: INestApplication;

  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    await app.init();

    prisma = app.get(PrismaService);

    await prisma.cleanDb();
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'wakanda23@gmail.com',
      password: '12345',
    };
    describe('Signup', () => {
      it('should throw email exception', () => {
        return pactum
          .spec()
          .post('http://localhost:3333/auth/signUp')
          .withBody({ password: dto.password })
          .expectStatus(400);
      });
      it('should throw password exception', () => {
        return pactum
          .spec()
          .post('http://localhost:3333/auth/signUp')
          .withBody({ email: dto.email })
          .expectStatus(400);
      });
      it('should Signup', () => {
        return pactum
          .spec()
          .post('http://localhost:3333/auth/signUp')
          .withBody(dto)
          .expectStatus(201);
      });
    });

    describe('Signin', () => {
      it('should throw email exception', () => {
        return pactum
          .spec()
          .post('http://localhost:3333/auth/signIn')
          .withBody({ password: dto.password })
          .expectStatus(400);
      });
      it('should throw password exception', () => {
        return pactum
          .spec()
          .post('http://localhost:3333/auth/signIn')
          .withBody({ email: dto.email })
          .expectStatus(400);
      });
      it('should signin', () => {
        return pactum
          .spec()
          .post('http://localhost:3333/auth/signIn')
          .withBody(dto)
          .expectStatus(200);
      });
    });
  });

  describe('User', () => {
    describe('Get me', () => {});

    describe('Edit user', () => {});
  });

  describe('Bokmark', () => {
    describe('Create bookmark', () => {});

    describe('Get bookmarks', () => {});

    describe('Get bookmark by id ', () => {});

    describe('Edit bookmark', () => {});

    describe('Delete bookmark', () => {});
  });
});
