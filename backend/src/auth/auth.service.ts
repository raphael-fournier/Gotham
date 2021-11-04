import {forwardRef, HttpException, HttpStatus, Inject, Injectable} from "@nestjs/common";
import {UserService} from "../user/user.service";
import {User} from "../model/user.entity";
import * as bcrypt from "bcrypt";
import {JwtService} from "@nestjs/jwt";
import {CreateUserDTO} from "./auth.dto";
import {JwtPayload} from "./auth.utils";

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService)) private userService: UserService,
    @Inject(forwardRef(() => JwtService)) private jwtService: JwtService
  ) {
  }

  async login(
    username: string,
    password: string
  ): Promise<{ token: string, user: User }> | undefined {
    const user: User = await this.userService.getByUsername(username);

    if (!user.checkIfUnencryptedPasswordIsValid(password)) {
      throw new HttpException("Bad password", HttpStatus.UNAUTHORIZED);
    }

    const payload: JwtPayload = {username: user.username, userId: user.id, role: user.role};
    return {token: this.jwtService.sign(payload), user};
  }

  async register(createUserDTO: CreateUserDTO): Promise<User> {
    let user: User = null;
    try {
      user = await this.userService.getByUsername(createUserDTO.username);
    } catch (error) {
      // ok
    }

    if (user) {
      throw new HttpException("User already exists with this username!", HttpStatus.BAD_REQUEST);
    }

    user = new User();
    user.username = createUserDTO.username;
    user.password = createUserDTO.password;
    user.email = createUserDTO.email;
    return this.userService.create(user);
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.userService.getByUsername(username);
    if (user && bcrypt.compareSync(password, user.password)) {
      return user;
    }
    return null;
  }
}