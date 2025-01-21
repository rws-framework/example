import { RWSHTTPRoutingEntry } from '@rws-framework/server/src/routing/routes';
import { homeRoutes } from './actions/homeActions';
import { deepgramRoutes } from './actions/deepgramActions';
import { userRoutes } from './actions/userActions';


export default [
    {
        prefix: '/api',
        controllerName: 'home',
        routes: homeRoutes
    },
    {
        prefix: '/api/deepgram',
        controllerName: 'deepgram',
        routes: deepgramRoutes
    },
    {
        prefix: '/api/users',
        controllerName: 'user',
        routes: userRoutes
    },

] as RWSHTTPRoutingEntry[];
