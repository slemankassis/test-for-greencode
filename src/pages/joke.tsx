import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/router";

const Joke = () => {
  const router = useRouter();
  const joke = router.query.id as string;

  return (
    <Box padding="2rem" maxWidth="800px" margin="auto">
      <Typography variant="h1">Shared Joke</Typography>
      <Typography>{joke}</Typography>
      <Button
        onClick={router.back}
        variant="contained"
        color="primary"
        fullWidth
      >
        Back
      </Button>
    </Box>
  );
};

export default Joke;
