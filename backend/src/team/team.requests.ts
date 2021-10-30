import {IsNumber} from "class-validator";

export class CreateTeamDTO {
  @IsNumber({}, {each: true})
  public userIds: number[]
}