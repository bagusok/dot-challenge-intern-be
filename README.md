## Dot Indonesia Internship Backend Challenge

Backend project untuk Challenge Backend Dot Indonesia Internship.

Aplikasi ini adalah **anonymous chat** (mirip NGL), di mana user bisa menerima pesan anonim dari user lain.

## Project Pattern

Pattern yang saya pakai adalah **Modular Monolith**.
yaitu:

- Project dibagi per fitur, misalnya `auth`, `messages`, `users`.
- Bagian `controller` menerima request dari client.
- Bagian `service` mengerjakan logika utama.
- Bagian `prisma` dipakai untuk akses database.
- Bagian `common` dipakai untuk hal umum seperti error handler, decorator, dan format response.

Kenapa saya pilih pattern ini:

1. **Mudah dipahami**: Alur kode jelas dari controller ke service lalu ke database.
2. **Rapi dan terstruktur**: Kode tidak tercampur, jadi lebih mudah dibaca.
3. **Mudah dikembangkan**: Kalau fitur bertambah, tinggal tambah module baru.
4. **Mudah testing**: Karena logic terpisah di service, test unit dan e2e lebih gampang dibuat.
5. **Cocok untuk belajar dan production awal**: Tidak terlalu rumit, tapi tetap mengikuti praktik yang baik di NestJS.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
