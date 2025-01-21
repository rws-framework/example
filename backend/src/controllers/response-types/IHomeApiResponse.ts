import IUser from "../../models/interfaces/IUser"

export interface IUserLoginApiResponse {
    success: boolean,
    data: {
        user: IUser | null,
        token: string | null
    } | null,
    error?: string
}

export interface IUserLoginApiPayload {
    username: string,
    passwd: string
}