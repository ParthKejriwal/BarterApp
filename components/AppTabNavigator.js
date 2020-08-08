import React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Exchange from '../screens/ExchangeScreen';
import HomeScreen from '../screens/HomeScreen';



export const AppTabNavigator = createBottomTabNavigator({
  HomeScreen : {
    screen: HomeScreen,
    navigationOptions :{
      tabBarIcon : <Image source={require("../assets/home-icon.png")} style={{width:20, height:20}}/>,
      tabBarLabel : "Home",
    }
  },
  Exchange: {
    screen: Exchange,
    navigationOptions :{
      tabBarIcon : <Image source={require("../assets/ads-icon.png")} style={{width:20, height:20}}/>,
      tabBarLabel : "Exchange Items",
    }
  }
});
