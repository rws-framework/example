import { RWSViewComponent, RWSView, observable, attr } from '@rws-framework/client';
import { IUser, IUserLoginApiPayload, IUserLoginApiResponse } from '../../backendImport';

@RWSView('users-login-form')
class LoginForm extends RWSViewComponent {      
    @observable onLogin: (user: IUser, token: string) => void;
    @attr submitLabel: string = 'Log in.'

    connectedCallback(): void 
    {
        super.connectedCallback();  
    }

    async sendForm(event: Event){               
        const formData: IUserLoginApiPayload = {
            username: (this.$('sl-input[name="username"]') as HTMLInputElement).value,
            passwd: (this.$('sl-input[name="password"]') as HTMLInputElement).value,            
        };

        const serverResponse: IUserLoginApiResponse = await this.apiService.back.post('home.login', formData);

        if(serverResponse.success && serverResponse.data?.token){
            this.onLogin(serverResponse.data?.user as IUser, serverResponse.data.token);
            
        }else{
            alert('Login failed!');
        }
    }
}

LoginForm.defineComponent();

export { LoginForm };