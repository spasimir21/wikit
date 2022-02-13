import { Body, Controller, HttpCode, HttpException, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { RegisterDto, validateRegisterDto } from './dto/register.dto';
import { RefreshDto, validateRefreshDto } from './dto/refresh.dto';
import { LoginDto, validateLoginDto } from './dto/login.dto';
import { IgnoreExpiredTokenGuard } from '@wikit/utils';
import { ValidateBodyGuard } from '@wikit/utils';
import { AuthService } from './auth.service';
import { Response } from 'express';

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
  async logout(@Res() res: Response): Promise<void> {
    await this.authService.logout(res.locals.token.raw);
    res.send(); // Required because we inject the response
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(IgnoreExpiredTokenGuard, new ValidateBodyGuard(validateRefreshDto))
  async refresh(@Res() res: Response, @Body() dto: RefreshDto): Promise<void> {
    const tokens = await this.authService.refresh(res.locals.token, dto.refreshToken);
    if (tokens == null) throw new HttpException('Refresh failed!', HttpStatus.BAD_REQUEST);
    res.send(tokens);
  }
}

export { AuthController };
