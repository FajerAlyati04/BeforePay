import { createContext, useContext, useReducer } from 'react'
import { services as initialServices, cardInfo as initialCard } from '../data'

const AppContext = createContext(null)

const initialState = {
  services: initialServices,
  card: initialCard,
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_DECISION':
      return {
        ...state,
        services: state.services.map(s =>
          s.id === action.id ? { ...s, decision: action.decision } : s
        ),
      }
    case 'CLEAR_DECISION':
      return {
        ...state,
        services: state.services.map(s =>
          s.id === action.id ? { ...s, decision: null } : s
        ),
      }
    case 'SET_MONTHLY_LIMIT':
      return { ...state, card: { ...state.card, monthlyLimit: action.limit } }
    case 'TOGGLE_FREEZE':
      return { ...state, card: { ...state.card, frozen: !state.card.frozen } }
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}
