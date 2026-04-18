import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Test Token Login (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

  beforeAll(async () => {
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'e2e-jwt-secret';
    process.env.DATABASE_URL = process.env.DATABASE_URL || 'file:./e2e.db';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());

    await app.init();

    prisma = app.get(PrismaService);
  });

  beforeEach(async () => {
    await prisma.messages.deleteMany();
    await prisma.users.deleteMany();
  });

  afterAll(async () => {
    await prisma.messages.deleteMany();
    await prisma.users.deleteMany();
    await app.close();
  });

  it('should register and return JWT token on login', async () => {
    const payload = {
      name: 'Test Token',
      username: 'testToken',
      email: 'testToken@example.com',
      password: 'Strong-Password123!',
    };

    await request(app.getHttpServer())
      .post('/auth/register')
      .send(payload)
      .expect(HttpStatus.CREATED)
      .expect(({ body }) => {
        expect(body.success).toBe(true);
        expect(body.message).toBe('User registered successfully');
      });

    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: payload.email,
        password: payload.password,
      })
      .expect(HttpStatus.CREATED)
      .expect(({ body }) => {
        expect(body.success).toBe(true);
        expect(body.message).toBe('Login successful');
        expect(typeof body.data?.token).toBe('string');
      });
  });

  it('should return 400 when login credentials are invalid', async () => {
    const payload = {
      name: 'Invalid Login',
      username: 'invalid_login',
      email: 'invalid.login@example.com',
      password: 'StrongPassword123!',
    };

    await request(app.getHttpServer())
      .post('/auth/register')
      .send(payload)
      .expect(HttpStatus.CREATED);

    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: payload.email,
        password: 'WrongPassword123!',
      })
      .expect(HttpStatus.BAD_REQUEST)
      .expect(({ body }) => {
        expect(body.success).toBe(false);
        expect(body.message).toBe('Invalid email or password');
      });
  });
});
