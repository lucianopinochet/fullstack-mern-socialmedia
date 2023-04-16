import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Form from "./Form";

const LoginPage = () => { // set Login component
  const theme = useTheme(); // use theme given by parents
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");// query if the width of the display is 1000px or higher
  return (
    <Box>{/* Component that let you wrap other component with css styling*/}
      <Box 
        width="100%"
        backgroundColor={theme.palette.background.alt}
        p="1rem 6%"
        textAlign="center"
      >
        <Typography fontWeight="bold" fontSize="32px" color="primary">{/* component that let you style the typography of the content*/}
          Sociopedia
        </Typography>
      </Box>
      <Box 
        width={isNonMobileScreens ? "50%" : "93%"}
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
        backgroundColor={theme.palette.background.alt}
      >
        <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem" }}>
          Welcome to Socipedia, the Social Media for Sociopaths!
        </Typography>
        <Form />{/* insert component form */}
      </Box>
    </Box>
  );
};

export default LoginPage;
