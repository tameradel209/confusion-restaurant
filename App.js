import React, {Component} from 'react';
import Main from './Components/MainComponent';
import {connect, Provider} from 'react-redux'
import {ConfigureStore} from './Redux/ConfigureStore'
import {PersistGate} from 'redux-persist/es/integration/react'
import { Loading } from './Components/LoadingComponent'
import {createStackNavigator} from 'react-navigation'
import {login} from './Redux/ActionCreators'
import {initializeFirebase} from './firebase' 

const { persistor, store} = ConfigureStore()

class App extends Component {

  componentDidMount(){
    initializeFirebase()
  }
  render(){
    return (
      <Provider store={store}>
        <PersistGate Loading={<Loading/>} persistor={persistor} >
          <Main />
        </PersistGate>
      </Provider>
      
    )
  }
}

const mapStateToProps = state => ({
	user: state.user
})

export default App