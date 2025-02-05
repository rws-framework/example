import { RWSViewComponent, RWSView, observable } from '@rws-framework/client';

@RWSView('docs-component-create')
class ComponentCreateDocs extends RWSViewComponent {      
    @observable activeSection: string = 'overview';
    
    private codeExamples = {
        basicComponent: `
import { RWSViewComponent, RWSView, observable } from '@rws-framework/client';

@RWSView('my-component')
class MyComponent extends RWSViewComponent {      
    @observable title: string = 'Hello RWS';
    
    connectedCallback(): void {
        super.connectedCallback();        
    }
}

MyComponent.defineComponent();
export { MyComponent };`,
        
        templateExample: `
<div class="my-component">
    <h1>\${x => x.title}</h1>
    \${T.when(x => x.isVisible, T.html\`
        <div>Warunkowy content</div>
    \`)}
    
    <ul>
        \${T.repeat(x => x.items, T.html\`
            <li>\${(x, c) => c}</li>
        \`)}
    </ul>
</div>`,
        
        styleExample: `
.my-component {
    // Style są automatycznie scopowane
    h1 {
        color: #333;
    }
    
    .some-class {
        background: #fff;
        
        &:hover {
            background: #eee;
        }
    }
}`
    };

    switchSection(section: string): void {
        this.activeSection = section;
    }

    getCodeExample(key: string): string {
        return this.codeExamples[key];
    }

    connectedCallback(): void {
        super.connectedCallback();        
    }
}

ComponentCreateDocs.defineComponent();

export { ComponentCreateDocs };
