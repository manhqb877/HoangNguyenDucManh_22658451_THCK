import { getAll, restoreMovie } from "@/db";
import { Movie } from "@/types/Movie";
import { useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useState } from "react";
import { FlatList, View } from "react-native";
import MovieDeletedItem from "@/components/MovieDeletedItem";

const MovieTrashScreen = () => {
  const db = useSQLiteContext();
  const [movies, setMovies] = useState<Movie[]>([]);

  const fetchDB = () => {
    getAll(db, 1).then((res) => setMovies(res));
  };

  const handleRestore = (id: number) => {
    restoreMovie(db, id).then(fetchDB);
  };

  useFocusEffect(
    useCallback(() => {
      fetchDB();
    }, [db])
  );

  return (
    <View className="flex flex-1">
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id!.toString()}
        renderItem={({ item }) => (
          <MovieDeletedItem data={item} onRestore={handleRestore} />
        )}
      />
    </View>
  );
};

export default MovieTrashScreen;
