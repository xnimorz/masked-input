 import React, { Component } from 'react';
 import { render } from 'react-dom';
 import styled from 'styled-components';

import MaskInput  from 'react-maskinput';
import NumberInput from 'react-numberinput';
import PlainMaskInput from 'mask-input';

const MaskedInput = styled(MaskInput)`
    border-radius: 10px;
    border-color: rgb(112, 120, 219);
    &:focus, &:hover {
        border-color: rgb(112, 120, 219);
    }
`;

const StyledNumberInput = styled(NumberInput)`
    border-radius: 10px;
    border-color: rgb(112, 120, 219);
    &:focus, &:hover {
        border-color: rgb(112, 120, 219);
    }
`;
 
class DateInput extends Component {
    state = {
        maskString: 'ДД.ММ.ГГГГ',
        mask: '00.00.0000',
    }

    onChange = (e) => {
        if (parseInt(e.target.value[6],  10) > 2) {
            this.setState({
                maskString: 'ДД.ММ.ГГ',
                mask: '00.00.00',
            });
        } else {
            this.setState({
                maskString: 'ДД.ММ.ГГГГ',
                mask: '00.00.0000',
            });
        }
    }

    render() {
        return (
            <MaskInput 
                onChange={this.onChange}
                maskString={this.state.maskString}
                mask={this.state.mask}
                {...this.props}
            />
        );
    }
}

class Code extends Component {
    state = {
        active: false,
    }

    activate = () => {
        this.setState({active: true});
    }

    render() {
        if (!this.state.active) {
            return (
                <div className='code-gap'>
                    <button onClick={this.activate}>
                        Show Code 
                    </button>
                </div>
            );
        }

        return (
            <div className='code'>
                <code>
                    {this.props.children}
                </code>
            </div>
        )
    }
}

class ManagebleValue extends Component {
    state  = {
        value: '1234',
    };

    onChange = (e) => {
        this.setState({
            value: e.target.value.replace(/-/g, ''),
        });
    }

    render() {
        return (
            <div>
                Value is {this.state.value}
                <MaskInput 
                    onChange={this.onChange}                
                    mask={'0000-0000'}
                    value={this.state.value}                
                />
            </div>
        );
    }
}

class NumberWithState extends Component {
    state = {
        value: '',
    }

    onChange = (e) => {
        this.setState({value: e.target.value.replace(/\D/g, '')});
    }

    render() {
        return (
            <div>
                State value is {this.state.value}
                <NumberInput 
                    onChange={this.onChange}                     
                />
            </div>
        );
    }
}

class ManagebleNumber extends Component {
    state = {
        value: '',
    }

    onChange = (e) => {
        this.setState({value: e.target.value.replace(/\D/g, '')});
    }

    render() {
        return (
            <div>
                State value is {this.state.value}
                <NumberInput 
                    onChange={this.onChange} 
                    value={this.state.value}
                />
            </div>
        );
    }
}

class CreditCard extends Component {
    state = {        
        mask: '0000-0000-0000-0000',
    }

    onChange = (e) => {
        if (            
            e.target.value.indexOf('34') === 0 ||
            e.target.value.indexOf('37') === 0
        ) {
            this.setState({                
                mask: '0000-000000-00000',
            });
            return;
        }
                   
        this.setState({            
            mask: '0000-0000-0000-0000',
        });        
    }

    render() {
        return (
            <MaskInput 
                onChange={this.onChange}                
                mask={this.state.mask}
                maskChar='_'
                alwaysShowMask
            />
        );
    }
}

class Example extends Component {        
    componentDidMount() {
        this.maskInput = new PlainMaskInput(this.refs.maskInput, {
            mask: '0000-0000-0000-0000'
        });
    }

    componentWillUnmount() {
        this.maskInput.destroy();
    }

    render() {
        
        return (
            <div>
                <h1>Masked inputs</h1> <a href='https://github.com/xnimorz/masked-input'>Project on github</a>
                <div className='gap'></div>
                <h2><a href='https://github.com/xnimorz/masked-input/tree/master/react-maskinput'><span className='github'></span>react-maskinput</a></h2>
                <div>
                    A react component for creating formatted inputs.
                </div>                
                Classic usage: credit card
                <MaskInput
                    alwaysShowMask
                    maskChar='_'
                    mask='0000-0000-0000-0000'                    
                /> 
                <Code>
                    {`
<MaskInput
    alwaysShowMask
    maskChar='_'
    mask='0000-0000-0000-0000'                        
/>
                    `}
                </Code>
                <div className='gap'></div>                
                Credit card with automatic switching between visa and american express format (for amex format write 34 or 37)
                <CreditCard />
                <Code>
                    {`
class CreditCard extends Component {
    state = {        
        mask: '0000-0000-0000-0000',
    }

    onChange = (e) => {
        if (            
            e.target.value.indexOf('34') === 0 ||
            e.target.value.indexOf('37') === 0
        ) {
            this.setState({                
                mask: "0000-000000-00000",
            });
            return;
        }
                   
        this.setState({            
            mask: '0000-0000-0000-0000',
        });        
    }

    render() {
        return (
            <MaskInput 
                onChange={this.onChange}
                maskChar='_'                
                mask={this.state.mask}
                alwaysShowMask
            />
        );
    }
}
                    `}
                </Code>
                <div className='gap'>
                    MaskInput with preseted value:
                    <MaskInput
                        alwaysShowMask
                        maskChar='_'
                        mask='0000-{0}-0000'
                        defaultValue='123456789'
                    />
                    <Code>
                        {`
<MaskInput
    alwaysShowMask
    maskChar='_'
    mask='0000-{0}-0000'
    defaultValue='123456789'
/>
                        `}
                    </Code>
                </div>
                <div className='gap'>
                    MaskInput with manageble value:
                    <ManagebleValue />
                    <Code>
                        {`
class ManagebleValue extends Component {
    state  = {
        value: '1234',
    };

    onChange = (e) => {
        this.setState({
            value: e.target.value.replace('-', ''),
        });
    }

    render() {
        return (
            <MaskInput 
                onChange={this.onChange}                
                mask={'0000-0000'}
                value={this.state.value}                
            />
        );
    }
}                        
                        `}
                    </Code>
                </div>
                <div className='gap'>
                    Date input with custom year (2 or 4 numbers):
                    <DateInput alwaysShowMask/>
                    <Code>
                            {`
class DateInput extends Component {
    state = {
        maskString: 'ДД.ММ.ГГГГ',
        mask: '00.00.0000',
    }

    onChange = (e) => {
        if (parseInt(e.target.value[6],  10) > 2) {
            this.setState({
                maskString: 'ДД.ММ.ГГ',
                mask: '00.00.00',
            });
        } else {
            this.setState({
                maskString: 'ДД.ММ.ГГГГ',
                mask: '00.00.0000',
            });
        }
    }

    render() {
        return (
            <MaskInput 
                onChange={this.onChange}
                maskString={this.state.maskString}
                mask={this.state.mask}
                {...this.props}
            />
        );
    }
}                            
                            `}
                    </Code>
                </div>
                <div className='gap'>
                    Date input with placeholder (using previous component):
                    <DateInput placeholder='Enter your birthdate DD.MM.YYYY' showMask />
                    <Code>
                        {`<DateInput placeholder='Enter your birthdate DD.MM.YYYY' showMask />`}
                    </Code>
                </div>

                <div className='gap'> 
                    List of specific react-maskinput props:
                    <ul>
                        <li>mask,</li>
                        <li>reformat,</li>
                        <li>maskFormat,</li>
                        <li>maskChar,</li>
                        <li>maskString,</li>
                        <li>showMask,</li>
                        <li>alwaysShowMask,</li>
                        <li>getReference,</li>
                        <li>onChange</li>
                    </ul>

                    All other props'll passed to `input` element directly. So you can set up class name, data attributes, etc.

                    Use react-maskinput with custom class:
                    <MaskInput
                        className='custom-input'
                        alwaysShowMask
                        maskString='0000-(TEXT)-0000'
                        mask='0000-(aaaa)-0000'                         
                    /> 
                    <Code>
                            {`
<MaskInput
    className='custom-input'
    alwaysShowMask
    maskString='0000-(TEXT)-0000'
    mask='0000-(aaaa)-0000'                    
/>                             
                            `}
                    </Code>
                    <p>
                        Use react-maskinput with styled-components:
                    </p>
                        <MaskedInput                            
                            alwaysShowMask
                            maskChar='_'
                            mask='0000-0000-0000-0000'  
                        /> 
                    <Code>
                            {`
import React, { Component } from 'react';
import MaskInput from 'react-maskinput';
import styled from 'styled-components';

const MaskedInput = styled(MaskInput)\`
    border-radius: 10px;
    border-color: rgb(112, 120, 219);
    &:focus, &:hover {
        border-color: rgb(112, 120, 219);
    }
\`;

render(    
    <MaskedInput
        alwaysShowMask
        maskChar='_'
        mask='0000-0000-0000-0000'        
    />
);                      `}
                    </Code>                      
                    
                </div>

                <div className='gap'>
                    Get HtmlElement input:                    
                    <MaskInput
                        getReference={(el) => this.input = el}                                                
                        maskChar='_'   
                        alwaysShowMask                        
                        mask='0000-0000-0000'                         
                    /> 
                    <Code>
                            {`
<MaskInput
    getReference={(el) => this.input = el} /* Now in this.input stored input HtmlElement */    
    alwaysShowMask 
    maskChar='_'   
    mask='0000-0000-0000'                    
/>                             
                            `}
                    </Code>
                </div>

                

                <h2><a href='https://github.com/xnimorz/masked-input/tree/master/react-numberinput'><span className='github'></span>react-numberinput</a></h2>
                A react component, that allows input formatted numbers:

                <div className='gap'>
                    <NumberInput />
                </div> 

                <div className='gap'>
                    In onChange event you can receive on processing value:
                    <NumberWithState />

                    <Code>
                        {`
class NumberWithState extends Component {
    state = {
        value: '',
    }

    onChange = (e) => {
        this.setState({value: e.target.value.replace(/\D/g, '')});
    }

    render() {
        return (
            <div>
                State value is {this.state.value}
                <NumberInput 
                    onChange={this.onChange}                     
                />
            </div>
        );
    }
}                        
                        `}
                    </Code>
                </div>               

                <div className='gap'>
                    If you want to change value and set up new:
                    <ManagebleNumber />

                    <Code>
                        {`
class ManagebleNumber extends Component {
    state = {
        value: '',
    }

    onChange = (e) => {
        this.setState({value: e.target.value.replace(/\D/g, '')});
    }

    render() {
        return (
            <div>
                State value is {this.state.value}
                <NumberInput 
                    onChange={this.onChange}                     
                    value={this.state.value}
                />
            </div>
        );
    }
}                        
                        `}
                    </Code>
                </div>
                <div className='gap'>
                    You can use react number input component with styled-components:
                    <StyledNumberInput />

                    <Code>{`
import React, { Component } from 'react';
import MaskInput from 'react-maskinput';
import NumberInput from 'react-numberinput';

const StyledNumberInput = styled(NumberInput)\`
    border-radius: 10px;
    border-color: rgb(112, 120, 219);
    &:focus, &:hover {
        border-color: rgb(112, 120, 219);
    }
\`;

render(    
    <StyledNumberInput />
);`}                        
                    </Code>
                </div>            
                <h2><a href='https://github.com/xnimorz/masked-input/tree/master/mask-input'><span className='github'></span>mask-input</a></h2>
                In case you don't use react. (This component didn't test on mobile browsers)
                <input ref='maskInput' />                

                <Code>
                    {`
componentDidMount() {
    this.maskInput = new MaskInput(this.refs.maskInput, {
        mask: '0000-0000-0000-0000'
    });
}

componentWillUnmount() {
    this.maskInput.destroy();
}                    

render() {
    return (<input ref='maskInput' />)
}
                    `}
                </Code>

                <div className='gap'>
                    Fork me on <a href='https://github.com/xnimorz/masked-input'>github</a>
                </div>
                <div className='gap'></div>
            </div>        
        );
    }
}

render(
    <Example />,
    document.querySelector('#example')
);
