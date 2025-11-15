import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import "../global.css";
import { Stack } from "expo-router";
import { Text } from "react-native";
import { SQLiteProvider } from "expo-sqlite";
import { initTables } from "@/db";

export default function Layout() {
  return (
    <SQLiteProvider databaseName="movies.db" onInit={(db) => initTables(db)}>
      <SafeAreaProvider>
        <SafeAreaView className="flex flex-1">

          <Text className="text-3xl font-bold text-center">Movie Watchlist</Text>

          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(tabs)" />
          </Stack>

        </SafeAreaView>
      </SafeAreaProvider>
    </SQLiteProvider>
  );
}
