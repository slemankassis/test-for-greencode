import { useRouter } from "next/router";
import {
  Button,
  Input,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Paper,
  NoSsr,
  Box,
} from "@mui/material";
import { Delete, Favorite, Share } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useJokeFetcher } from "@/hooks/useJokeFetcher";

const JokeCard = styled(Paper)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "1rem",
  margin: "1rem 0",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3],
  [theme.breakpoints.down("sm")]: {
    alignItems: "center",
    textAlign: "center",
  },
  width: "96%",
}));

const SearchInput = styled(Input)(({ theme }) => ({
  marginBottom: "1rem",
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
}));

const ListItemTextStyled = styled(ListItemText)(({ theme }) => ({
  whiteSpace: "nowrap",
  overflow: "hidden",
  textWrap: "pretty",
  textOverflow: "ellipsis",
}));

const App = () => {
  const router = useRouter();
  const {
    joke,
    handleLikeJoke,
    handleRemoveJoke,
    handleSearch,
    search,
    handleGetJoke,
    filteredJokes,
    jokesListRef,
    isOnSorting,
  } = useJokeFetcher();

  const handleGoToJoke = (joke) =>
    router.push(`/joke?id=${encodeURIComponent(joke)}`);

  return (
    <Box padding="2rem" maxWidth="800px" margin="auto">
      <Typography variant="h1">Random Joke</Typography>

      {joke && (
        <JokeCard elevation={3}>
          <Typography variant="body1">{joke}</Typography>
          <Box>
            <IconButton
              onClick={handleLikeJoke}
              color="primary"
              aria-label="Favorite"
            >
              <Favorite />
            </IconButton>
            <IconButton
              onClick={() =>
                router.push(`/joke?id=${encodeURIComponent(joke)}`)
              }
              color="primary"
              aria-label="Share permanent link"
            >
              <Share />
            </IconButton>
          </Box>
        </JokeCard>
      )}
      <Button
        onClick={handleGetJoke}
        variant="contained"
        color="primary"
        fullWidth
      >
        Get a new random Joke
      </Button>

      <Box my={4}>
        <Typography variant="h2">Liked Jokes</Typography>
        <SearchInput
          value={search}
          onChange={handleSearch}
          placeholder="Search..."
        />

        <NoSsr>
          <List ref={jokesListRef}>
            {filteredJokes.map((joke, index) => (
              <ListItem
                key={index}
                sx={{ cursor: isOnSorting ? "move" : "pointer" }}
              >
                <JokeCard
                  elevation={3}
                  onClick={() => handleGoToJoke(joke)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleGoToJoke(joke);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <ListItemText
                    primary={<ListItemTextStyled>{joke}</ListItemTextStyled>}
                  />
                  <IconButton
                    edge="end"
                    aria-label="Delete"
                    onClick={(e: React.MouseEvent<HTMLElement>) => {
                      e.stopPropagation();
                      handleRemoveJoke(joke);
                    }}
                  >
                    <Delete />
                  </IconButton>
                  <IconButton
                    onClick={(e: React.MouseEvent<HTMLElement>) => {
                      e.stopPropagation();
                      handleGoToJoke(joke);
                    }}
                    aria-label="Share permanent link"
                  >
                    <Share />
                  </IconButton>
                </JokeCard>
              </ListItem>
            ))}
          </List>
        </NoSsr>
      </Box>
    </Box>
  );
};

export default App;
