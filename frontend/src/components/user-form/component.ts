import { RWSViewComponent, RWSView, observable, attr } from '@rws-framework/client';
import { IUser } from '../../backendImport';
import { IUserCreateApiPayload, IUserCreateApiResponse } from 'backend/src/controllers/response-types/IUserApiResponse';

@RWSView('users-create-form')
class UsersForm extends RWSViewComponent {      
    @observable onCreate: (user: IUser) => void;
    @attr submitLabel: string = 'Zaloguj się.'

    connectedCallback(): void 
    {
        super.connectedCallback();  
    }

    async sendForm(event: Event){               
        const formData: IUserCreateApiPayload = {
            username: (this.$('sl-input[name="username"]') as HTMLInputElement).value,
            passwd: (this.$('sl-input[name="password"]') as HTMLInputElement).value,
            r_passwd: (this.$('sl-input[name="r_password"]') as HTMLInputElement).value,
        };

        const serverResponse: IUserCreateApiResponse = await this.apiService.back.post('user.create', formData);

        if(!serverResponse.success){

            alert(serverResponse.data);

            return;
        }else{
            this.onCreate(serverResponse.data as IUser);
        }
    }
}

UsersForm.defineComponent();

export { UsersForm };