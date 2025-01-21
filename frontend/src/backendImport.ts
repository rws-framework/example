import type { IUserLoginApiPayload, IUserLoginApiResponse } from '../../backend/src/controllers/response-types/IHomeApiResponse';
import type { IDeepGramApiResponse, ITranscriptionData } from '../../backend/src/controllers/response-types/IDeepGramApiResponse';
import type { IDeepGramWSData, IDeepGramWSResponse } from '../../backend/src/gateways/response-types/IDeepgramGateWay';
import type { IUserListApiResponse, IUserCreateApiResponse, IUserCreateApiPayload, IUserDeleteApiResponse } from '../../backend/src/controllers/response-types/IUserApiResponse';
import type IUser from '../../backend/src/models/interfaces/IUser';
import type ITranscription from '../../backend/src/models/interfaces/ITranscription';

export type {
    ITranscription,
    IUser,
    IDeepGramApiResponse,
    IDeepGramWSData, IDeepGramWSResponse,
    ITranscriptionData,
    IUserListApiResponse,
    IUserCreateApiResponse,
    IUserCreateApiPayload,
    IUserDeleteApiResponse,
    IUserLoginApiPayload, 
    IUserLoginApiResponse
};