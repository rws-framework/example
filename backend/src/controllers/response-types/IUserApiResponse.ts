import IApiKey from "../../models/interfaces/IApiKey"
import IUser from "../../models/interfaces/IUser"

export interface IUserListApiResponse {
    data: IUser[]
}

export interface IUserCreateApiResponse {
    success: boolean
    data: IUser | string
}

export interface IUserCreateKeyApiResponse {
    success: boolean
    data: IApiKey | string
}

export interface IUserCreateApiPayload {
    username: string;
    passwd: string;
    r_passwd: string
}

export interface IUserDeleteApiResponse {
    success: boolean
}