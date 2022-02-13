import { User, Token, MatchUser, MatchToken, CreateUser, CreateToken, DeleteToken } from '@wikit/database';
import { DatabaseConnection } from '@wikit/neo4ogm';
import { Inject, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import * as jsonwebtoken from 'jsonwebtoken';
import { LoginDto } from './dto/login.dto';
import { Config } from '@wikit/config';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
class AuthService {
  constructor(@Inject('CONFIG') private readonly config: Config, private readonly database: DatabaseConnection) {}

  async register(dto: RegisterDto): Promise<[string, string] | null> {
    const matchingUsers = await this.database.run(MatchUser, { username: dto.username, email: dto.email });
    if (matchingUsers.records.length > 0) return null;

    const user = User.create({
      username: dto.username,
      email: dto.email,
      password: await bcrypt.hash(dto.password, this.config.auth.salt_rounds)
    });

    const refreshToken = randomBytes(this.config.auth.refresh_token_length).toString('hex');
    const token = jsonwebtoken.sign({ uuid: user.uuid }, this.config.token.secret, {
      expiresIn: this.config.token.token_lifetime
    });

    await this.database.run(CreateUser, { user });
    await this.database.run(CreateToken, {
      token: Token.create({ refreshToken, token }),
      uuid: user.uuid
    });

    return [token, refreshToken];
  }

  async login(dto: LoginDto): Promise<[string, string] | null> {
    const matchingUsers = await this.database.run(MatchUser, { username: dto.usernameOrEmail, email: dto.usernameOrEmail });
    if (matchingUsers.records.length == 0) return null;

    const user = matchingUsers.records[0].user;

    if (!(await bcrypt.compare(dto.password, user.password))) return null;

    const refreshToken = randomBytes(this.config.auth.refresh_token_length).toString('hex');
    const token = jsonwebtoken.sign({ uuid: user.uuid }, this.config.token.secret, {
      expiresIn: this.config.token.token_lifetime
    });

    await this.database.run(CreateToken, {
      token: Token.create({ refreshToken, token }),
      uuid: user.uuid
    });

    return [token, refreshToken];
  }

  async logout(token: string): Promise<void> {
    await this.database.run(DeleteToken, { token });
  }

  async refresh(token: { raw: string; data: any }, refreshToken: string): Promise<[string, string] | null> {
    const matchingTokens = await this.database.run(MatchToken, { token: token.raw, refreshToken });
    if (matchingTokens.records.length == 0) return null;

    await this.database.run(DeleteToken, { token: token.raw });

    const newRefreshToken = randomBytes(this.config.auth.refresh_token_length).toString('hex');
    const newToken = jsonwebtoken.sign({ uuid: token.data.uuid }, this.config.token.secret, {
      expiresIn: this.config.token.token_lifetime
    });

    await this.database.run(CreateToken, {
      token: Token.create({ refreshToken: newRefreshToken, token: newToken }),
      uuid: token.data.uuid
    });

    return [newToken, newRefreshToken];
  }
}

export { AuthService };
