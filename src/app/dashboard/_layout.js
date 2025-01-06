import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Marketplace from "./Marketplace";
import Notification from "./Notification";
import Settings from "./Setting";
import Category from "./CategoryPage";
import EditProf from "./EditProfile";
import Message from "./Message";
import MessagePage from "./MessagePage";
import Myprofile from "./Myprofile";
import Notif from "./Notification";
import Product from "./ProductSelectedHome";
import SellProd from "./SellProduct";
import MySavedPage from "./MySavedPage";
import ProductSelectedHome from "./ProductSelectedHome";
import EditProduct from "./EditProduct";
import SellerProfile from "./SellerProfile";
import SearchProd from "./SearchProd";
import Homepage from "./Homepage";
import { CardStyleInterpolators } from '@react-navigation/stack';

const DashboardStack = createStackNavigator();

const DashboardLayout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DashboardStack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, // swipe transition for horizontal direction
        }}
        initialRouteName="Homepage"
      >
        <DashboardStack.Screen
          name="Homepage"
          component={Homepage}
          options={{
            gestureEnabled: true, 
            gestureDirection: 'horizontal',
          }}
        />
        <DashboardStack.Screen
          name="Marketplace"
          component={Marketplace}
          options={{
            gestureEnabled: true,
            gestureDirection: 'horizontal',
          }}
        />
        <DashboardStack.Screen name="Notification" component={Notification} />
        <DashboardStack.Screen
          name="Settings"
          component={Settings}
          options={{
            gestureEnabled: true,
            gestureDirection: 'horizontal',
          }}
        />
        <DashboardStack.Screen name="Category" component={Category} />
        <DashboardStack.Screen name="Edit" component={EditProf} />
        <DashboardStack.Screen name="Message" component={Message} />
        <DashboardStack.Screen name="MsgPage" component={MessagePage} />
        <DashboardStack.Screen name="SavedPage" component={MySavedPage} />
        <DashboardStack.Screen name="Profile" component={Myprofile} />
        <DashboardStack.Screen name="Notif" component={Notif} />
        <DashboardStack.Screen name="Product" component={Product} />
        <DashboardStack.Screen name="SellProduct" component={SellProd} />
        <DashboardStack.Screen name="ProductSelectedHome" component={ProductSelectedHome} />
        <DashboardStack.Screen name="Editprod" component={EditProduct} />
        <DashboardStack.Screen name="SellerProfile" component={SellerProfile} />
        <DashboardStack.Screen name="SearchProd" component={SearchProd} />
      </DashboardStack.Navigator>
    </GestureHandlerRootView>
  );
};

export default DashboardLayout;
