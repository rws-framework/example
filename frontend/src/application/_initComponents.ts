import { DefaultLayout } from '../components/default-layout/component';
import { RWSClientInstance } from '@rws-framework/client/src/client';
import { RWSTable } from '../components/rws-table/component'
import { RWSModal } from '../components/rws-modal/component'

import { RouterComponent } from '@rws-framework/browser-router';

export default () => {
    RouterComponent;
    DefaultLayout;
    RWSClientInstance.defineAllComponents();

    RWSTable;
    RWSModal;
};