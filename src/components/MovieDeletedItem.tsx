import { Movie } from "@/types/Movie";
import { View } from "react-native";
import { Button, Card, Text } from "react-native-paper";

type Props = {
  data: Movie;
  onRestore: (id: number) => void;
};

const MovieDeletedItem = ({ data, onRestore }: Props) => {
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
          <Button mode="contained" onPress={() => onRestore(data.id!)}>
            Restore
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );
};

export default MovieDeletedItem;
