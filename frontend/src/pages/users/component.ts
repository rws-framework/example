import { RWSViewComponent, RWSView, observable, ApiService } from '@rws-framework/client';
import type { IUser } from '../../backendImport';
import moment from 'moment';
import { UsersForm } from '../../components/user-form/component';
import { IUserCreateApiResponse, IUserCreateKeyApiResponse, IUserListApiResponse } from '../../../../backend/src/controllers/response-types/IUserApiResponse';
import IApiKey from 'backend/src/models/interfaces/IApiKey';

UsersForm;

@RWSView('page-users')
class UsersPage extends RWSViewComponent {  
    @observable userList: IUser[] = [];
    @observable selectedUser: IUser = null;
    @observable tableColumns = [
        { key: 'username', header: 'Username' },
        { 
            key: 'active', 
            header: 'Active',
            formatter: (value: boolean) => value ? 'YES' : 'NO'
        },
        { 
            key: 'created_at', 
            header: 'Created',
            formatter: (date: Date) => moment(date).format('DD.MM.YYYY')
        }
    ];

    connectedCallback(): void 
    {
        super.connectedCallback();    
        this.getUsers();
    }

    async getUsers()
    {
        const response: IUserListApiResponse = await this.apiService.back.get('user.index');
        this.userList = response.data;     
        
        console.log(this.userList);
    }

    async deleteUser(id: string){
        if(confirm('Do you want to delete user?')){
            await this.apiService.back.get('user.delete', { routeParams: {
                id
            } });
            this.getUsers();
        }        
    }

    async showAPIKeys(id: string){
        this.selectedUser = this.userList.find(item => item.id === id);        
    }

    async generateAPIKey(id: string){
        if(confirm('Want to generate API key?')){
            const apiKeyResponse: IUserCreateKeyApiResponse = await this.apiService.back.get('user.createkey', { routeParams: {
                id
            } });        

            if(apiKeyResponse.success){
                this.userList = this.userList.map((user: IUser) => {
                    if(user.id === id){
                        const userKeys = user.apiKeys;

                        user.apiKeys = [
                            ...userKeys,
                            apiKeyResponse.data as IApiKey
                        ];

                        this.selectedUser = {...user};
                    }

                    return user;
                })
            }
        }
    }

    async deleteAPIKey(id: string){
        if(confirm('Do you want to delete api key?')){
            await this.apiService.back.get('user.deletekey', { routeParams: {
                id
            } });
                   
            const user_id = this.selectedUser.id;
            await this.getUsers();
            this.selectedUser = {...this.userList.find(list_user => list_user.id === user_id)};
        }        
    }

    addToUserList(user: IUser){
        this.getUsers();
    }

    closeModal()
    {
        this.selectedUser = null;
        this.getUsers();
    }
}

UsersPage.defineComponent();

export { UsersPage };