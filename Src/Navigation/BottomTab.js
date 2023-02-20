import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Image, Text, TouchableOpacity, Keyboard } from 'react-native';

import Category from '../Screens/Category';
import Offers from '../Screens/Offers';
import MyAccount from '../Screens/MyAccount';
import Cart from '../Screens/CartPage';
import Home from '../Screens/Home';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { setCartGlobalVarsF } from '../Helper/cartcounthelper';
import { CartStack, HomeStack } from './Navigation';
import { CategoryStack } from './Navigation';

const Tab = createBottomTabNavigator();
const BottomTab = ({ navigation }) => {


  const [Count, setCount] = useState(0)
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      CartCountF();
       setCartGlobalVarsF({ showCartCountF: CartCountF });
    });
    return () => unsubscribe;

  }, []);
  const CartCountF = async () => {
    var cartCount = await AsyncStorage.getItem('CartCount');
    setCount(cartCount == null ? 0 : cartCount);
  }  

  const checkToken = async () => {
    let CustomerToken = await AsyncStorage.getItem('CustomerToken');
    let IsExistingCustomer = await AsyncStorage.getItem('IsExistingCustomer');
    if (CustomerToken == '' || CustomerToken == null) {
      navigation.navigate('Loginwithotp', { pagefrom: 'MyAccount' })
    }
    else {
      navigation.navigate('MyAccount')
    }
    if (IsExistingCustomer == 'False') {
      setExisting(false);
    }
  }
  const getWishlist = async () => {

    let customerToken = await AsyncStorage.getItem('CustomerToken');

    if (customerToken == null || customerToken == '') {
      navigation.navigate('Loginwithotp', { pagefrom: 'WishlistPage' });

    } else {
      navigation.navigate('WishlistPage');

    }
  }

  return (
    <Tab.Navigator      
      tabBarOptions={{
        showLabel: false,
        activeTintColor: '#debf79',
        inactiveTintColor: '#fff',
      }}
      screenOptions={{
        tabBarStyle: { height: 55 },
      }}
    >

      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
          
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center' }}>
              <Image
                source={require('../../asserts/Home.png')}
                resizeMode="contain"
                style={{
                  width: 20,
                  height: 20,
                }}
              />
              <Text style={{  color: '#262626', fontSize: 12, textAlign: 'center', paddingTop: 2,width:'100%' }}>Home</Text>
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Category"
        component={Category}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center' }}>
              <Image
                source={require('../../asserts/Categories.png')}
                resizeMode="contain"
                style={{
                  width: 20,
                  height: 20,
                }}
              />
              <Text style={{  color: '#262626', fontSize: 12, textAlign: 'center', paddingTop: 2,width:'100%' }}>Categories</Text>
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Offers"
        component={Offers}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center' }}>
              <Image
                source={require('../../asserts/BundleOffers.png')}
                resizeMode="contain"
                style={{
                  width: 20,
                  height: 20,
                }}
              />
              <Text numberOfLines={1} style={{  color: '#262626', fontSize: 12, textAlign: 'center', paddingTop: 2,width:'100%' }}>Bundle Offers</Text>
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="MyAccount"
        component={MyAccount}
        options={{
          headerShown: false,
          tabPress: ({ navigation }) => {
          },
          tabBarIcon: ({ focused }) => (
            <TouchableOpacity
              onPress={() =>
                // console.log('pressed')
                checkToken()
              }
            >
              <View style={{ alignItems: 'center' }}>
                <Image
                  source={require('../../asserts/MyAccount.png')}
                  resizeMode="contain"
                  style={{
                    width: 20,
                    height: 20,
                  }}
                />
                <Text style={{  color: '#262626', fontSize: 12, textAlign: 'center', paddingTop: 2,width:'100%' }}>My Account</Text>
              </View>
            </TouchableOpacity>
          ),
        }}
      />

      <Tab.Screen
        name="Cart"
        component={Cart}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View style={{ justifyContent: 'center', marginLeft: 10 }}>
              <TouchableOpacity onPress={() => navigation.navigate('Cart',{wish:'wish'})}
                testID={'btnnavcart'} style={{ flexDirection: 'row', alignItems: 'center', }}>
                <Image source={require('../../asserts/Cart.png')} resizeMode="contain"
                  style={{ width: 24, height: 24, }} />
                <View style={{ height: 18, width: 18, backgroundColor: '#e82f40', borderRadius: 10, justifyContent: 'center', alignItems: 'center', right: 12, bottom: 4 }}>
                  <Text style={{  color: '#fff', fontSize: Count > 9 ? 10 : 12}}>{Count}</Text>
                </View>

              </TouchableOpacity>
              <Text style={{  color: '#262626', fontSize: 12, paddingTop: 2,width:'100%' }}>Cart</Text>

            </View>          
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default BottomTab;