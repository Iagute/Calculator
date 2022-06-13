import React, { useReducer } from 'react';
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';
import './styles.css';

// Mis acciones
export const ACTIONS = {
    ADD_DIGIT: 'add-digit',
    CHOOSE_OPERATION: 'choose-operation',
    CLEAR: 'clear',
    DELETE_DIGIT : 'delete_digit', 
    EVALUATE: 'evaluate'
}

function reducer(state, { type, payload}) {
    switch(type) {
        
        case ACTIONS.ADD_DIGIT:
            // Si después de realizar una operación, escribís algo, se sobreescribe
            if (state.overwrite) {
                return {
                    ...state,
                    currentOperand: payload.digit,
                    overwrite: false,
                }
            }
            // Si la calculadora ya tiene un 0, no lo vuelvas a poner
            if (payload.digit === '0' && state.currentOperand === '0') {
                return state
            }
            // Si la calculadora ya tiene un ., no lo vuelvas a poner
            if (payload.digit === '.' && state.currentOperand.includes('.')) {
                return state
            }

            return {
                ...state,
                    // Crea mis nuevos Dígitos
                currentOperand: `${state.currentOperand || "" }${payload.digit}`
        }

        case ACTIONS.CHOOSE_OPERATION:
            // Si la operación actual no tiene ningún dígito, no hagas nada
            if (state.currentOperand == null && state.previousOperand == null) {
                return state
            }
            // Si te equivocaste de operación y no pusiste ningún número, reemplaza la operación
            if (state.currentOperand == null) {
                return{
                    ...state,
                    operation: payload.operation
                }
            }
            // Si hiciste una operación, creá una nueva
            if (state.previousOperand == null) {
                return {
                    ...state,
                    operation: payload.operation,
                    previousOperand: state.currentOperand,
                    currentOperand: null
                }
            }

            // Agarra la operación actual y la anterior y las manda a evaluar
            return {
                ...state,
                previousOperand: evaluate(state),
                operation: payload.operation,
                currentOperand: null
            }

            // Si apretás AC, borrá todo
        case ACTIONS.CLEAR: 
            return {}

        case ACTIONS.DELETE_DIGIT:
            // Si estoy reescribiendo, quiero que DEL me devuelva un objeto vacío
            if (state.overwrite) 
                return {
                    ...state,
                    overwrite: false,
                    currentOperand: null
                }
            // Si no tengo nada, que no haga nada
            if (state.currentOperand == null) return state
            // Si borro el último dígito, que la operación sea null
            if (state.currentOperand === 1) {
                return {...state, currentOperand: null}
            }
            // Borra el último dígito
            return {
                ...state,
                currentOperand: state.currentOperand.slice(0, -1)
            }

        case ACTIONS.EVALUATE:
                // Si la calculadora no tiene nada, el = no ejecuta ninguna funcion
            if (
                state.operation == null ||
                state.currentOperand == null ||
                state.previousOperand == null
            ) {
                return state
            }
                // Evalúa la operación
            return {
                ...state,
                overwrite: true,
                previousOperand: null,
                operation: null,
                currentOperand: evaluate (state)
            }

    }
}

// Crea comas para los 0 si hay un 1000
const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
    maximumFractionDigits: 0,
})
// No entendí B)
function formatOperand(operand) {
    if (operand == null) return
    const [integer, decimal] = operand.split('.')
    if (decimal == null) return INTEGER_FORMATTER.format(integer)
    return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}


// Evalúa las operaciones
function evaluate ({ currentOperand, previousOperand, operation }) {
    const prev = parseFloat(previousOperand)
    const current = parseFloat(currentOperand)
    if (isNaN(prev) || isNaN(current)) return ""
    let computation = ""
    switch (operation) {
        case "÷":
            computation = prev / current
            break
        case "*":
            computation = prev * current
            break
        case "+":
            computation = prev + current
            break
        case "-":
            computation = prev - current
            break
    }

     return computation.toString();
}   

function App()  {

    const [{ currentOperand, previousOperand, operation}, dispatch] = useReducer(
        reducer, 
        {}
    )


    return (
    <div className='calculator-grid'>
        <div className='output'>
            <div className='previous-operand'> {previousOperand} {operation} </div>
            <div className='current-operand'>{formatOperand (currentOperand)} </div>
        </div>
        <button className='span-two' onClick={( ()=> dispatch({type: ACTIONS.CLEAR}))}>AC</button>
        <button onClick={( ()=> dispatch({type: ACTIONS.DELETE_DIGIT}))}>DEL</button>
        <OperationButton operation="÷" dispatch={dispatch}/>
        <DigitButton digit="1" dispatch={dispatch}/>
        <DigitButton digit="2" dispatch={dispatch}/>
        <DigitButton digit="3" dispatch={dispatch}/>
        <OperationButton operation="*" dispatch={dispatch}/>
        <DigitButton digit="4" dispatch={dispatch}/>
        <DigitButton digit="5" dispatch={dispatch}/>
        <DigitButton digit="6" dispatch={dispatch}/>
        <OperationButton operation="+" dispatch={dispatch}/>
        <DigitButton digit="7" dispatch={dispatch}/>
        <DigitButton digit="8" dispatch={dispatch}/>
        <DigitButton digit="9" dispatch={dispatch}/>
        <OperationButton operation="-" dispatch={dispatch}/>
        <DigitButton digit="." dispatch={dispatch}/>
        <DigitButton digit="0" dispatch={dispatch}/>
        <button className='span-two' onClick={( ()=> dispatch({type: ACTIONS.EVALUATE}))}>=</button>
    </div>
    )
}

export default App