import {UserBody} from './user.request';
import {User} from '../model/user.entity';
import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {UserRepository} from "./user.repository";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository) private readonly UserRepo: UserRepository,
  ) {
  }

  async getAllUsers(): Promise<User[]> {
    return await this.UserRepo.find();
  }

  async getUserById(userID: number): Promise<User> {
    try {
      return await this.UserRepo.findOneOrFail(userID);
    } catch (error) {
      throw new HttpException('Could not find user', HttpStatus.NOT_FOUND);
    }
  }

  async getByEmail(email: string): Promise<User> {
    try {
      return await this.UserRepo.findOneOrFail({where: {email: email}});
    } catch (error) {
      throw new HttpException('Could not find user by email', HttpStatus.NOT_FOUND);
    }
  }

  async getByUsername(username: string): Promise<User> {
    try {
      return await this.UserRepo.findOneOrFail({where: {username: username}});
    } catch (error) {
      throw new HttpException('Could not find user by username', HttpStatus.NOT_FOUND);
    }
  }

  async addUser(UserBody: UserBody): Promise<User> {
    let user: User = new User();

    user.username = UserBody.username
    user.email = UserBody.email

    try {
      return await this.UserRepo.save(user)
    } catch (error) {
      throw new HttpException(`Could not create user : ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async putUser(userID: number, UserBody: UserBody): Promise<User> {
    let user: User = await this.getUserById(userID)

    if (UserBody.username) {
      user.username = UserBody.username
    }
    if (UserBody.email) {
      user.email = UserBody.email
    }

    try {
      return await this.UserRepo.save(user)
    } catch (error) {
      throw new HttpException(`Could not update user : ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteUser(userID: number): Promise<User> {
    let user: User = await this.getUserById(userID)

    try {
      return await this.UserRepo.remove(user);
    } catch (error) {
      throw new HttpException(`Could not remove user: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
