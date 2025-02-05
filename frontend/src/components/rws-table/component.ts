import { RWSViewComponent, RWSView, observable } from '@rws-framework/client';

export interface IFlexTableColumn {
    key: string;
    header: string;
    formatter?: (value: any) => string;
}

export type ActionType = {
    key: string,
    label: string,
    variant: string,
    handler: (id: string) => Promise<void>
}
 
@RWSView('rws-table')
class RWSTable extends RWSViewComponent {      
    @observable columns: IFlexTableColumn[] = [];
    @observable data: any[] = [];

    @observable actions: ActionType[] = [];


    connectedCallback(): void {
        super.connectedCallback();        
    }
}

RWSTable.defineComponent();

export { RWSTable };