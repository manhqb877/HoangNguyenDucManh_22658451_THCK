import { getAll, createMovie, softDeleteMovie, toggleWatched } from "@/db";
import { Movie } from "@/types/Movie";
import { useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  Text,
  View,
  Modal,
  Pressable,
  Alert,
} from "react-native";
import { SegmentedButtons, TextInput, Button } from "react-native-paper";
import MovieItem from "@/components/MovieItem";

const MovieListScreen = () => {
  const db = useSQLiteContext();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [titleSearch, setTitleSearch] = useState("");
  const [watchedFilter, setWatchedFilter] = useState("All");

  const [modalVisible, setModalVisible] = useState(false);
  const [newMovie, setNewMovie] = useState({ title: "", year: "", rating: "" });

  const fetchDB = () => {
    getAll(db, 0).then((res) => setMovies(res));
  };

  const handleSoftDelete = (id: number) => {
    softDeleteMovie(db, id).then(() => fetchDB());
  };

  const handleToggleWatched = (movie: Movie) => {
    toggleWatched(db, movie.id!, movie.watched!).then(fetchDB);
  };

  useFocusEffect(
    useCallback(() => {
      fetchDB();
    }, [db])
  );

  const filteredMovies = useMemo(() => {
    return movies
      .filter((m) => m.title.toLowerCase().includes(titleSearch.toLowerCase()))
      .filter((m) =>
        watchedFilter === "All"
          ? true
          : watchedFilter === "Watched"
          ? m.watched === 1
          : m.watched === 0
      );
  }, [titleSearch, watchedFilter, movies]);

  const handleAddMovie = async () => {
    const { title, year, rating } = newMovie;
    const currentYear = new Date().getFullYear();

    // Validation
    if (!title.trim()) {
      Alert.alert("Validation", "Title không được để trống");
      return;
    }
    if (year) {
      const y = Number(year);
      if (isNaN(y) || y < 1900 || y > currentYear) {
        Alert.alert("Validation", `Year phải từ 1900 đến ${currentYear}`);
        return;
      }
    }

    const moviePayload: Movie = {
      title: title.trim(),
      year: year ? Number(year) : null,
      rating: rating ? Number(rating) : null,
      watched: 0,
    };

    await createMovie(db, moviePayload);
    fetchDB();
    setModalVisible(false);
    setNewMovie({ title: "", year: "", rating: "" });
  };

  return (
    <View className="flex flex-1">
      <View className="px-4">
        <Text className="text-lg font-bold p-4">Search Movies</Text>

        <TextInput
          label="Title"
          value={titleSearch}
          onChangeText={setTitleSearch}
        />

        <SegmentedButtons
          value={watchedFilter}
          onValueChange={setWatchedFilter}
          buttons={[
            { value: "All", label: "All" },
            { value: "Watched", label: "Watched" },
            { value: "Unwatched", label: "Unwatched" },
          ]}
        />

        <Button
          mode="contained"
          className="mt-4"
          onPress={() => setModalVisible(true)}
        >
          +
        </Button>
      </View>

      {filteredMovies.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text>Chưa có phim nào trong danh sách.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredMovies}
          keyExtractor={(item) => item.id!.toString()}
          renderItem={({ item }) => (
            <MovieItem
              data={item}
              onDelete={handleSoftDelete}
              onToggleWatched={handleToggleWatched}
            />
          )}
        />
      )}

      {/* Modal thêm phim */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 w-11/12 rounded-lg">
            <Text className="text-lg font-bold mb-4">Thêm phim mới</Text>

            <TextInput
              label="Title *"
              value={newMovie.title}
              onChangeText={(v) => setNewMovie((p) => ({ ...p, title: v }))}
              className="mb-2"
            />

            <TextInput
              label="Year"
              keyboardType="number-pad"
              value={newMovie.year}
              onChangeText={(v) => setNewMovie((p) => ({ ...p, year: v }))}
              className="mb-2"
            />

            <TextInput
              label="Rating"
              keyboardType="number-pad"
              value={newMovie.rating}
              onChangeText={(v) => setNewMovie((p) => ({ ...p, rating: v }))}
              className="mb-2"
            />

            <View className="flex-row justify-end gap-2 mt-4">
              <Button mode="outlined" onPress={() => setModalVisible(false)}>
                Cancel
              </Button>
              <Button mode="contained" onPress={handleAddMovie}>
                Save
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MovieListScreen;
