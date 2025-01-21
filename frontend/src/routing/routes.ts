

import { renderRouteComponent } from '@rws-framework/browser-router';
import { UsersPage } from '../pages/users/component';

export default {
    '/': renderRouteComponent('Users page', UsersPage)
};