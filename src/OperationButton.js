import {ACTIONS} from './App'

export default function OperationButton({ dispatch, operation }) {
    return  (
        <button 
                    // imprime mi nueva operación
            onClick={() => dispatch({type: ACTIONS.CHOOSE_OPERATION, payload: { operation }})}
        >
            {operation}
        </button>
    )
        
}