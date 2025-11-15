import { Link, useRouter } from "expo-router";
import React from "react";
import {  View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {Button, Text, TextInput} from "react-native-paper";

export default function Page() {

  const router = useRouter();
  return (
    <View className="flex flex-1 justify-center items-center">
      <Text className="text-3xl font-bold mb-4">Movie Watchlist Information</Text>

      <View className="w-full gap-4 px-4">
        <TextInput label="Name" value="Đức Mạnh" />
        <TextInput label="ID" value="123" />
        <TextInput label="Class" value="456" />

        <Button
          mode="contained"
          onPress={() => router.navigate("(tabs)/list")}
        >
          Go to Movie Manager
        </Button>
      </View>
    </View>
  );
}


