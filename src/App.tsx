import {View} from 'react-native';
import React from 'react';
import Router from './router';
import BaseStyle from './theme/styles';
import {Provider} from 'react-redux';
import {store} from './store';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const App = () => {
  return (
    <GestureHandlerRootView>
      <View style={BaseStyle.pages}>
        <Provider store={store}>
          <Router />
        </Provider>
      </View>
    </GestureHandlerRootView>
  );
};

export default App;
