import {StyleSheet, View} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Create, Home} from '../pages';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../theme/color';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeTabs() {
  const TAB_ICON = {
    HomeStack: 'home',
    CreateStack: 'card-account-details',
  };
  const activeTab = (
    focused: any,
    size: number,
    color: any,
    iconName: string,
  ) => {
    return focused ? (
      <View style={styles.iconFocused}>
        <MaterialCommunityIcons
          style={styles.icon}
          name={iconName}
          size={size}
          color={color}
        />
      </View>
    ) : (
      <MaterialCommunityIcons name={iconName} size={size} color={color} />
    );
  };

  const iconOptions = ({route}: {route: any}) => {
    const iconName = TAB_ICON[route.name as keyof typeof TAB_ICON];
    return {
      tabBarIcon: ({
        focused,
        size,
        color,
      }: {
        focused: boolean;
        size: number;
        color: string;
      }) => {
        size = focused ? 24 : 20;
        return activeTab(focused, size, color, iconName);
      },
      tabBarActiveTintColor: Colors.bottomTabs,
    };
  };

  return (
    <Tab.Navigator initialRouteName="MapPage" screenOptions={iconOptions}>
      <Tab.Screen
        name="HomeStack"
        component={Home}
        options={{
          headerShown: false,
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="CreateStack"
        component={Create}
        options={{
          headerShown: false,
          tabBarLabel: 'Create',
        }}
      />
    </Tab.Navigator>
  );
}

const Route = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeTabs}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Route;

const styles = StyleSheet.create({
  iconFocused: {
    borderTopWidth: 2,
    width: '100%',
    height: '100%',
    borderColor: 'blue',
  },
  icon: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
