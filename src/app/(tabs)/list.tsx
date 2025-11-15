import { getAll, softDeleteMovie, toggleWatched } from "@/db";
import { Movie } from "@/types/Movie";
import { useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useMemo, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { SegmentedButtons, TextInput } from "react-native-paper";
import MovieItem from "@/components/MovieItem";

const MovieListScreen = () => {
  const db = useSQLiteContext();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [titleSearch, setTitleSearch] = useState("");
  const [watchedFilter, setWatchedFilter] = useState("All");

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

  return (
    <View className="flex flex-1">
      <View>
        <Text className="text-lg text-bold p-4">Search Movies</Text>

        <TextInput
          label="Title"
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
    </View>
  );
};

export default MovieListScreen;
