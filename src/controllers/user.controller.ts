import { _dbContext } from "../configs";
import { Body, Controller, Get, Post, Route, Security, Tags } from "tsoa";
import { UserService } from "../services";
import { IApiResponse, ILogin } from "../types";
import { IUsers } from "../entities";

@Route("api/user")
@Tags("Authentication")
export class UserController extends Controller {
  private _userService = UserService.getInstance();

  @Post("/signup")
  public async signup(@Body() user: Partial<IUsers>): Promise<IApiResponse<string>> {
    const res = await this._userService.createUser(user);
    this.setStatus(res.status);
    return res;
  }
  @Post("/signin")
  public async signin(@Body() user: ILogin): Promise<IApiResponse<Partial<IUsers>>> {
    var res = await this._userService.findUserForLogin(user);
    this.setStatus(res.status);
    return res;
  }
  @Get("/users")
  @Security("jwt")
  public async users(): Promise<IApiResponse<Partial<IUsers>[]>> {
    var res = await this._userService.getUsers();
    this.setStatus(res.status);
    return res;
  }
}
