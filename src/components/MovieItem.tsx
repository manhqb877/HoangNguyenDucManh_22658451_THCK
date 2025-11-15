import { Movie } from "@/types/Movie";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { Button, Card, Text } from "react-native-paper";

type Props = {
  data: Movie;
  onDelete: (id: number) => void;
  onToggleWatched: (movie: Movie) => void;
};

const MovieItem = ({ data, onDelete, onToggleWatched }: Props) => {
  const router = useRouter();

  const onPressEdit = () => {
    router.push({ pathname: "(tabs)/form", params: { id: data.id } });
  };

  return (
    <View className="m-2">
      <Card>
        <Card.Title title={data.title} />

        <Card.Content>
          <Text>Year: {data.year ?? "—"}</Text>
          <Text>Rating: {data.rating ?? "—"}</Text>
          <Text>Watched: {data.watched ? "Yes" : "No"}</Text>
        </Card.Content>

        <Card.Actions>
          <Button mode="contained" onPress={onPressEdit}>
            Edit
          </Button>
          <Button
            mode="contained"
            onPress={() => onToggleWatched(data)}
          >
            {data.watched ? "Unwatch" : "Watch"}
          </Button>
          <Button
            mode="contained"
            onPress={() => onDelete(data.id!)}
          >
            Delete
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );
};

export default MovieItem;
