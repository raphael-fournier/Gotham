import {Body, Controller, Post, Res} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {CreateUserDTO, LoginUserDTO} from "./auth.requests";
import {SkipAuth} from "./skip-auth.decorators";
import {User} from "../model/user.entity";

const TOKEN_AUTH_RES_HEADER = "token"

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {
  }

  @SkipAuth()
  @Post('ping')
  async pong(@Res() res): Promise<string> {
    return 'pong'
  }

  @SkipAuth()
  @Post('login')
  async login(
    @Body() body: LoginUserDTO,
    @Res() res
  ): Promise<string> {
    const newTokenPromise = this.authService.login(
      body.username,
      body.password
    );
    const newToken = await newTokenPromise;
    res.setHeader(TOKEN_AUTH_RES_HEADER, newToken);
    return newTokenPromise;
  }

  @SkipAuth()
  @Post('register')
  async register(
    @Body() body: CreateUserDTO,
    @Res() res
  ): Promise<User> {
    const userPromise = await this.authService.register(body);
    const user = await userPromise;
    const newTokenPromise = this.authService.login(
      user.username,
      body.password
    );
    const newToken = await newTokenPromise;
    res.setHeader(TOKEN_AUTH_RES_HEADER, newToken);
    return user;
  }
}
