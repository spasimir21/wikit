import { Body, Controller, HttpCode, HttpException, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { RegisterDto, validateRegisterDto } from './dto/register.dto';
import { RefreshDto, validateRefreshDto } from './dto/refresh.dto';
import { IgnoreExpiredTokenGuard, Token } from '@wikit/utils';
import { LoginDto, validateLoginDto } from './dto/login.dto';
import { ValidateBodyGuard } from '@wikit/utils';
import { AuthService } from './auth.service';

@Controller()
class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UseGuards(new ValidateBodyGuard(validateRegisterDto))
  async register(@Body() dto: RegisterDto): Promise<[string, string]> {
    const tokens = await this.authService.register(dto);
    if (tokens == null) throw new HttpException('Username or email already in use!', HttpStatus.BAD_REQUEST);
    return tokens;
  }

  @Post('login')
  @UseGuards(new ValidateBodyGuard(validateLoginDto))
  async login(@Body() dto: LoginDto): Promise<[string, string]> {
    const tokens = await this.authService.login(dto);
    if (tokens == null) throw new HttpException('Login failed!', HttpStatus.UNAUTHORIZED);
    return tokens;
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(IgnoreExpiredTokenGuard)
  async logout(@Token() token: Token): Promise<void> {
    await this.authService.logout(token.raw);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(IgnoreExpiredTokenGuard, new ValidateBodyGuard(validateRefreshDto))
  async refresh(@Token() token: Token, @Body() dto: RefreshDto): Promise<[string, string]> {
    const tokens = await this.authService.refresh(token, dto.refreshToken);
    if (tokens == null) throw new HttpException('Refresh failed!', HttpStatus.BAD_REQUEST);
    return tokens;
  }
}

export { AuthController };
