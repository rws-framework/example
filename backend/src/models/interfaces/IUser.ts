import IApiKey from "./IApiKey";

interface IUser {
  id?: string
  username: string
  passwd: string
  created_at?: Date
  updated_at?: Date
  active: boolean
  apiKeys?: IApiKey[]
}

export default IUser;