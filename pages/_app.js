import '../styles/global.css'
import 'antd/dist/antd.less'
import { Provider } from 'react-redux'
import { createStore, combineReducers } from 'redux'
import lists from '../reducers/list'
import admin from '../reducers/admin'

const store = createStore(combineReducers({lists, admin}))

export default function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  )
}
