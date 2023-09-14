import { IApiResponse, ILogin } from "../types";
import CrudService from "./crud.service";
import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../configs";
import { StatusCodes, getReasonPhrase } from "http-status-codes";
import { compare, hash } from "bcrypt";
import { IUsers } from "../entities";

export class UserService {
  private static _userService: UserService | null = null;
  private _userContext = new CrudService<Partial<IUsers>>("users");
  public static getInstance() {
    if (!this._userService) {
      this._userService = new UserService();
    }
    return this._userService;
  }
  async getUsers(): Promise<IApiResponse<Partial<IUsers>[]>> {
    const users = await this._userContext.getAll();
    const filteredUsers: Partial<IUsers>[] | undefined = users?.map((it) => {
      const { ["password"]: removedKey, ...rest } = it;
      return rest;
    });
    return {
      data: filteredUsers || [],
      status: users ? StatusCodes.OK : StatusCodes.NOT_FOUND,
    };
  }
  async createUser({ email, name, password }: Partial<IUsers>): Promise<IApiResponse<string>> {
    if (!password)
      return {
        data: getReasonPhrase(StatusCodes.BAD_REQUEST),
        status: StatusCodes.BAD_REQUEST,
      };
    const hashedPassword = await hash(password, 10);
    const useData: Partial<IUsers> = { email, name, password: hashedPassword };
    const res = await this._userContext.create(useData);
    return {
      data: getReasonPhrase(res?.id ? StatusCodes.CREATED : StatusCodes.BAD_REQUEST),
      status: res?.id ? StatusCodes.CREATED : StatusCodes.BAD_REQUEST,
    };
  }
  async findUserForLogin({ email, password }: ILogin): Promise<IApiResponse<Partial<IUsers>>> {
    const conditions: Partial<IUsers> = {
      email,
    };
    const user = await this._userContext.findOne(conditions);
    if (!user) {
      return {
        data: null,
        status: StatusCodes.BAD_REQUEST,
        error: getReasonPhrase(StatusCodes.BAD_REQUEST),
      };
    } else {
      var checkPassword = await compare(password, user.password);
      if (!checkPassword) {
        return {
          data: null,
          status: StatusCodes.BAD_REQUEST,
          error: getReasonPhrase(StatusCodes.BAD_REQUEST),
        };
      }
      const tokenData: Partial<IUsers> = {
        email: user.email,
        id: user.id,
        name: user.name,
      };
      const token = jwt.sign(tokenData, `${JWT_SECRET_KEY}`, { expiresIn: "15m" });
      return {
        data: tokenData,
        status: StatusCodes.OK,
        token,
      };
    }
  }
}
