import { RWSErrorCodes } from '@rws-framework/server';

const {RWSError} = RWSErrorCodes;

export class Error400 extends RWSError{
    name = '400 bad payload.';

    constructor(params: any | null = null){
        super(400, `Payload is not valid.`, params);        
    }
}