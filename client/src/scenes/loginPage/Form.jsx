import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";

const registerSchema = yup.object().shape({ // create a schema for a model with validation for the input for the forms (registration)
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
  location: yup.string().required("required"),
  occupation: yup.string().required("required"),
  picture: yup.string().required("required"),
});

const loginSchema = yup.object().shape({// create a schema for a model with validation for the input for the forms (login)
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
});

const initialValuesRegister = {// set initial values for the registration form
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  location: "",
  occupation: "",
  picture: "",
};

const initialValuesLogin = {// set initial values for the login form
  email: "",
  password: "",
};

const Form = () => {// component to setup registration and login
  const [pageType, setPageType] = useState("login");//set a state to know if the form will be the login or register page
  const { palette } = useTheme();//set the pallete of css values from the theme inhereted
  const dispatch = useDispatch();//function used to activate reducers 
  const navigate = useNavigate();//function used to move around paths
  const isNonMobile = useMediaQuery("(min-width:600px)");//css query to know if the dispaly has a width of 600 or higher
  const isLogin = pageType === "login";// boolean to knwo if pageType is login
  const isRegister = pageType === "register";// boolean to knwo if pageType is register
  const register = async (values, onSubmitProps) => {// this allows us to send form info with image to register
    const formData = new FormData();//set a object that repesent the form fields
    for (let value in values) {// append every field and their value to the form object
      formData.append(value, values[value]);
    }
    formData.append("picturePath", values.picture.name);//appends picture fields with the path of the picture as the value
   //for (const [key, value] of formData) console.log(key,value)
    const savedUserResponse = await fetch(// fetch data to the server 
      "http://localhost:3001/auth/register",
      {
        method: "POST",
        body: formData,
      }
    );
    const savedUser = await savedUserResponse.json(); // recive parse data if the registration was succesfull
    onSubmitProps.resetForm();// make the form inputs blank
    if (savedUser) {//if succesfull change pageType state to login, which reload the page to login page
      setPageType("login");
    }
  };
  const login = async (values, onSubmitProps) => {// this allows us to send form info to login
    const loggedInResponse = await fetch("http://localhost:3001/auth/login", {// fetch data from the server about the user info
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const loggedIn = await loggedInResponse.json();// recive parse data if the login was succesfull
    onSubmitProps.resetForm();// make the form inputs blank
    if (loggedIn) {//if succesfull set login info into store and load home page
      dispatch(
        setLogin({
          user: loggedIn.user,
          token: loggedIn.token,
        })
      );
      navigate("/home");
    }
  };
  const handleFormSubmit = async (values, onSubmitProps) => {// function that submit certain function depending in the values of pageType
    console.log(values, onSubmitProps)
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) await register(values, onSubmitProps);
  };
  return ( // return component form
    <Formik  //component system that handles forms 
      onSubmit={handleFormSubmit} // function executed when form is submited
      initialValues={isLogin ? initialValuesLogin : initialValuesRegister} // set initail values for inputs
      validationSchema={isLogin ? loginSchema : registerSchema} // validation schema for inputs
    >
      {({
        values, // initital values
        errors, // map of errors, depends on fields
        touched, // map that indicates if a a certain input has been touched
        handleBlur, // handler for inputs in case the input has been pass by
        handleChange, // handler for inputs in case the input has changed
        handleSubmit, // handler for form in case of submission
        setFieldValue, // fucntion for setting values in inputs
        resetForm, // reset form inputs
      }) => (
        <form onSubmit={handleSubmit}> {/*form init, handleSubmit triggred when form submited */}
          <Box // wrapper component to hold css utilitys
            display="grid" // set display to grid
            gap="30px" // set gap betweep grids of 30px
            gridTemplateColumns="repeat(4, minmax(0, 1fr))" // organize 4 colums in either 0 or 1 frame
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },  // css properity that determinates the proprtion of inputs, depending in the width size of the screen
            }}
          >
            {isRegister && ( // load register components if isRegister is true
              <>
                <TextField 
                  label="First Name" 
                  onBlur={handleBlur} 
                  onChange={handleChange} 
                  value={ values.firstName}
                  name="firstName"
                  error={
                    Boolean(touched.firstName) && Boolean(errors.firstName) //activates error handler if firstName input has been touched and are not valide
                  }
                  helperText={touched.firstName && errors.firstName}// activates help text if firstName input has been touched and are not valide
                  sx={{ gridColumn: "span 2" }} //if gridColumn is not define input takes 2 of 4 columns
                />
                <TextField
                  label="Last Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={ values.lastName}
                  name="lastName"
                  error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Location"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.location}
                  name="location"
                  error={Boolean(touched.location) && Boolean(errors.location)}
                  helperText={touched.location && errors.location}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  label="Occupation"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.occupation}
                  name="occupation"
                  error={
                    Boolean(touched.occupation) && Boolean(errors.occupation)
                  }
                  helperText={touched.occupation && errors.occupation}
                  sx={{ gridColumn: "span 4" }}
                />
                <Box
                  gridColumn="span 4"
                  border={`1px solid ${palette.neutral.medium}`}
                  borderRadius="5px"
                  p="1rem"
                >
                  <Dropzone // wrapper component for useDropzone
                    acceptedFiles=".jpg,.jpeg,.png" // accepted extensions
                    multiple={false}// boolean that indicates if there is going to be multiple or a single file uploaded
                    onDrop={(acceptedFiles) =>//set the value of the input to the picture
                      setFieldValue("picture", acceptedFiles[0])
                    }
                  >
                    {({ getRootProps, getInputProps }) => (
                      <Box
                        {...getRootProps()} // set dropzone props for the root of the input
                        border={`2px dashed ${palette.primary.main}`}
                        p="1rem"
                        sx={{ "&:hover": { cursor: "pointer" } }}
                      >
                        <input {...getInputProps()} /> {/*set input props */}
                        {!values.picture ? ( // depending if a file has been drop, shows a different message
                          <p>Add Picture Here</p>
                        ) : (
                          <FlexBetween> {/*styles component */}
                            <Typography>{values.picture.name}</Typography>
                            <EditOutlinedIcon />
                          </FlexBetween>
                        )}
                      </Box>
                    )}
                  </Dropzone>
                </Box>
              </>
            )}
            <TextField
              label="Email"
              onBlur={handleBlur}
              onChange={handleChange}
              value={ values.email}
              name="email"
              error={Boolean(touched.email) && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              label="Password"
              type="password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password}
              name="password"
              error={Boolean(touched.password) && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              sx={{ gridColumn: "span 4" }}
            />
          </Box>
          {/* BUTTONS */}
          <Box>
            <Button  // set a button for submitting
              fullWidth //takes full with of container
              type="submit"
              sx={{
                m: "2rem 0",
                p: "1rem",
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                "&:hover": { color: palette.primary.main },
              }}
            >
              {isLogin ? "LOGIN" : "REGISTER"}
            </Button>
            <Typography //set a input for moving between login or register display
              onClick={() => {
                setPageType(isLogin ? "register" : "login");
                resetForm();
              }}
              sx={{
                textDecoration: "underline",
                color: palette.primary.main,
                "&:hover": {
                  cursor: "pointer",
                  color: palette.primary.light,
                },
              }}
            >
              {isLogin
                ? "Don't have an account? Sign Up here."
                : "Already have an account? Login here."}
            </Typography>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default Form;
