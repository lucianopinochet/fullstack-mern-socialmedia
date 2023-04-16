import { Box } from "@mui/material";
import { styled } from "@mui/system";

const FlexBetween = styled(Box)({ // component to style another component 
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

export default FlexBetween;
