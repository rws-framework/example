import { RWSViewComponent, RWSView, observable, RWSInject } from '@rws-framework/client';

import EV from '../../events/events';
import { _ROUTING_EVENT_NAME, IRoutingEvent } from '@rws-framework/browser-router';
import { SiteMenu } from '../site-menu/component';
import StorageService, { StorageServiceInstance } from '../../services/StorageService';
import { IUser, IUserLoginApiResponse } from '../../backendImport';
import { LoginForm } from '../../components/login-form/component';

LoginForm;
SiteMenu;

@RWSView('default-layout', { ignorePackaging: true })
class DefaultLayout extends RWSViewComponent {  
  @observable currentPage: string;
  @observable menuOpen: boolean = true;
  @observable isLogged: boolean = false;
  @observable currentUrl: string = window.location.pathname;

  constructor(@RWSInject(StorageService) private storageService: StorageServiceInstance){
    super();
  }

  async connectedCallback(): Promise<void> 
  {
      super.connectedCallback();    
    
      this.$emit(_ROUTING_EVENT_NAME, (route_event: IRoutingEvent) => {
          this.currentPage = route_event.routeName;
      });

      this.$emit(EV.menu.toggle, (route_event: IRoutingEvent) => {
          this.menuOpen = !this.menuOpen;
      });

      this.on<{item: string}>('routing.url.changed', (event) => {
          const url = event.detail.item;
      
          this.currentUrl = url;      
      });

      this.on<{success: boolean}>('user_login', (event) => {
        const user: IUser | null = this.storageService.getUser();
    
        if(user && user.id){
            this.isLogged = true;
        }           
      });

      this.on('logout', (event) => {
        this.storageService.clearUser();
        this.apiService.setToken(null);
        
        this.isLogged = false;       
      });

      const storedJWT = this.storageService.getToken();

      if(storedJWT){
          const userData: IUserLoginApiResponse = await this.apiService.back.post('home.check', { token: storedJWT });

          if(userData.success){                           
              this.onLogin(userData.data.user, userData.data.token);
          }else{              
              this.storageService.clearUser();              
              this.apiService.setToken(null);
          }
      }
  }

  async onLogin(user: IUser, token: string)
    {
        this.storageService
            .setUser(user)
            .setToken(token);

        this.apiService.setToken(token);    
        
        this.isLogged = true;

        this.$emit('user_login', { success: true });
  }
}

DefaultLayout.defineComponent();

export { DefaultLayout };