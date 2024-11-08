import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';

import './mainStyle.css'
import App from './App'

// As of React 18
const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <Provider store={store} className="d-flex w-full flex-col h-[100vh] overflow-y-auto">
    <PersistGate loading={null} persistor={persistor}>
      <App/>
    </PersistGate>
  </Provider>
)

