import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { UserResolver } from './graphql/resolvers/UserResolver';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from './app.config';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/schema.gql',
    }),
    ConfigModule.forRoot({
      load: [appConfig],
    }),
  ],
  controllers: [],
  providers: [ConfigService, UserResolver],
})
export class AppModule {}
