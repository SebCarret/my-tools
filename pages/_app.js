import 'antd/dist/antd.css'
import '../styles/vars.css'
import '../styles/global.css'
import { Provider } from 'react-redux'
import { createStore, combineReducers } from 'redux'
import lists from '../reducers/list'

const store = createStore(combineReducers({lists}))

export default function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  )
}
