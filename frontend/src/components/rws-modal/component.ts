import { RWSViewComponent, RWSView, observable } from '@rws-framework/client';

@RWSView('rws-modal')
class RWSModal extends RWSViewComponent {      
    closeModal: () => void
    connectedCallback(): void {
        super.connectedCallback();        
    }
}

RWSModal.defineComponent();

export { RWSModal };