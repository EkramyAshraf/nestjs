// data-source.ts
import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from './src/users/user.entity';
import { Report } from './src/reports/report.entity';

const environment = process.env.NODE_ENV || 'development';

let dbOptions: DataSourceOptions;

switch (environment) {
  case 'development':
    dbOptions = {
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [User, Report],
      migrations: [__dirname + '/migrations/*.ts'],
      synchronize: false,
    };
    break;

  case 'test':
    dbOptions = {
      type: 'sqlite',
      database: 'test.sqlite',
      entities: [User, Report],
      migrations: [__dirname + '/migrations/*.ts'],
      migrationsRun: true,
      synchronize: false, // في التيست بنخليها true عشان يمسح ويكريت دايماً
    };
    break;

  case 'production':
    dbOptions = {
      type: 'postgres', // غيرنا النوع هنا
      url: process.env.DATABASE_URL, // المنصات زي Render و Heroku بتبعت الرابط ده جاهز
      entities: ['dist/**/*.entity.js'], // في البرودكشن بنقرأ الملفات المتحولة
      migrations: ['dist/migrations/*.js'],
      migrationsRun: true,
      synchronize: false, // ممنوع تفعيلها في البرودكشن نهائياً
      ssl: {
        rejectUnauthorized: false, // مهمة جداً عشان اتصالات الـ SSL في السيرفرات السحابية
      },
    };
    break;

  default:
    throw new Error('Unknown environment: ' + environment);
}

export const AppDataSource = new DataSource(dbOptions);

// npm run typeorm migration:generate -- ./migrations/initial-schema -d ./data-source.ts
// npm run typeorm migration:run -- -d ./data-source.ts
// "typeorm": "cross-env NODE_ENV=development node --require ts-node/register --require tsconfig-paths/register ./node_modules/typeorm/cli.js"   (package.json)
//  "allowJs": true   (ts.config)

// @Module({
//   imports: [
//     ConfigModule.forRoot({
//       isGlobal: true,
//       envFilePath: `.env.${process.env.NODE_ENV}`,
//     }),
//     TypeOrmModule.forRoot(AppDataSource.options),
//     UsersModule,
//     ReportsModule,
//   ],

// "moduleNameMapper": {
//   "^src/(.*)$": "<rootDir>/src/$1"
// }   (jest-e2e-json)
