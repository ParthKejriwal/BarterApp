import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';

import ExchangeScreen from '../screens/ExchangeScreen';
import RecieverDetailsScreen  from '../screens/RecieverDetailsScreen';




export const AppStackNavigator = createStackNavigator({
  ItemExchangeList : {
    screen : ExchangeScreen,
    navigationOptions:{
      headerShown : false
    }
  }
},
  {
    initialRouteName: 'ItemExchangeList'
  }
);
