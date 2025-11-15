import { Tabs } from "expo-router";
import { Icon } from "react-native-paper";
import React from "react";

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{ headerShown: false, tabBarActiveTintColor: "purple" }}
    >
      <Tabs.Screen
        name="list"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Icon
              source={focused ? "movie" : "movie-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="form"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Icon
              source={focused ? "lead-pencil" : "lead-pencil-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="trash"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Icon
              source={focused ? "trash-can" : "trash-can-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
