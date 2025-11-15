import { createMovie, getById, updateMovie } from "@/db";
import { Movie } from "@/types/Movie";
import {
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useState } from "react";
import { Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";

const MovieFormScreen = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();

  const [form, setForm] = useState<Movie>({ watched: 0 } as Movie);
  const db = useSQLiteContext();
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      if (id) {
        getById(db, Number(id)).then((res) => {
          setForm({
            ...res,
            watched: res.watched ?? 0,
          });
        });
      }
    }, [id, db])
  );

  const handleSave = async () => {
    if (!form.title) return;

    const payload: Movie = {
      ...form,
      year: form.year ? Number(form.year) : null,
      rating: form.rating ? Number(form.rating) : null,
      watched: form.watched ? 1 : 0,
    };

    if (id) await updateMovie(db, payload);
    else await createMovie(db, payload);

    handleReset();
    router.navigate("(tabs)/list");
  };

  const handleReset = () => {
    setForm({} as Movie);
  };

  return (
    <View className="flex flex-1 items-center justify-center">
      <View className="px-4 w-full gap-4">
        <Text className="text-lg">Movie Form</Text>

        <TextInput
          label="Title"
          value={form.title}
          onChangeText={(v) => setForm((p) => ({ ...p, title: v }))}
        />

        <TextInput
          label="Year"
          keyboardType="number-pad"
          value={form.year?.toString() || ""}
          onChangeText={(v) => setForm((p) => ({ ...p, year: Number(v) }))}
        />

        <TextInput
          label="Rating (1–5)"
          keyboardType="number-pad"
          value={form.rating?.toString() || ""}
          onChangeText={(v) => setForm((p) => ({ ...p, rating: Number(v) }))}
        />

        {/* Watched input (0 or 1) */}
        <TextInput
          label="Watched (0 = No, 1 = Yes)"
          keyboardType="number-pad"
          value={form.watched?.toString() || "0"}
          onChangeText={(v) =>
            setForm((p) => ({ ...p, watched: Number(v) === 1 ? 1 : 0 }))
          }
        />

        <Button mode="contained" onPress={handleSave}>
          Save
        </Button>
      </View>
    </View>
  );
};

export default MovieFormScreen;
