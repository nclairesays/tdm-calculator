import React from "react";
import * as accountService from "../services/account-service";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Link, withRouter } from "react-router-dom";
import * as Yup from "yup";
import { useToast } from "../contexts/Toast";

const Register = props => {
  const { match } = props;
  const initialValues = {
    firstName: "",
    lastName: "",
    email: match.params.email || "",
    password: "",
    passwordConfirm: ""
  };

  const registerSchema = Yup.object().shape({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string()
      .email("Invalid email address format")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be 8 characters at minimum")
      .required("Password is required"),
    passwordConfirm: Yup.string()
      .required("Confirm your password")
      .oneOf([Yup.ref("password")], "Password does not match")
  });

  const toast = useToast()

  const handleSubmit = async (
    { firstName, lastName, email, password },
    { setSubmitting, resetForm, setErrors },
    { history }
  ) => {
    try {
      const response = await accountService.register(
        firstName,
        lastName,
        email,
        password
      );
      if (response.isSuccess) {
        toast.add(`An confirmation email has been sent to ${email}. 
          Please check for a verification link and use it to confirm 
          that you own this email address.`)
        history.push("/login/" + email);
      } else if (response.code === "REG_DUPLICATE_EMAIL") {
        toast.add(`The email ${email} is already registered. Please 
          login or use the Forgot Password feature if you have 
          forgotten your password.`)
        setSubmitting(false);
      } else {
        toast.add(`An error occurred in sending the confirmation 
          message to ${email}. Try to log in, and follow the 
          instructions for re-sending the confirmation email.`)
        setSubmitting(false);
      }
    } catch (err) {
      toast.add(err.message)
      setSubmitting(false);
    }
    // TODO: figure out if there is a scanrio where you actually
    // want to reset the form, and move/copy the next line accordingly
    //resetForm(initialValues);
  };
  return (
    <div style={{ flex: "1 0 auto", display: "flex", flexDirection: "column" }} >
      <div className="tdm-wizard" style={{ flex: "1 0 auto", display: "flex", flexDirection: "row" }}>
        <div className="tdm-wizard-sidebar">
        </div>
        <div className="tdm-wizard-content-container" style={{justifyContent: "center"}}>
        
        <h1 style={{fontWeight: 500}}>Create a New Account</h1>
        <h3 style={{fontWeight: 100}}>Save your project information.</h3>
        <br />
        <div className="auth-form">
          <Formik
            initialValues={initialValues}
            validationSchema={registerSchema}
            onSubmit={(values, actions) => handleSubmit(values, actions, props)}
          >
          {({ touched, errors, isSubmitting }) => (
            <Form>
              <div className="form-group">
                <Field
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  className={`form-control ${
                    touched.firstName && errors.firstName ? "is-invalid" : ""
                  }`}
                />
                <ErrorMessage
                  name="firstName"
                  component="div"
                  className="invalid-feedback"
                />
              </div>
              <div className="form-group">
                <Field
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  className={`form-control ${
                    touched.lastName && errors.lastName ? "is-invalid" : ""
                  }`}
                />
                <ErrorMessage
                  name="lastName"
                  component="div"
                  className="invalid-feedback"
                />
              </div>
              <div className="form-group">
                <Field
                  type="email"
                  name="email"
                  placeholder="Email"
                  className={`form-control ${
                    touched.email && errors.email ? "is-invalid" : ""
                  }`}
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="invalid-feedback"
                />
              </div>
              <div className="form-group">
                <Field
                  type="password"
                  name="password"
                  placeholder="Password"
                  className={`form-control ${
                    touched.password && errors.password ? "is-invalid" : ""
                  }`}
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="invalid-feedback"
                />
              </div>
              <div className="form-group">
                <Field
                  type="password"
                  name="passwordConfirm"
                  placeholder="Retype Password"
                  className={`form-control ${
                    touched.passwordConfirm && errors.passwordConfirm
                      ? "is-invalid"
                      : ""
                  }`}
                />
                <ErrorMessage
                  name="passwordConfirm"
                  component="div"
                  className="invalid-feedback"
                />
              </div>

              <button
                type="submit"
                className="btn-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Please wait..." : "Create Account"}
              </button>
            </Form>
          )}
          </Formik>
        </div>
        <br/>
        <div>
          Already have an account? <Link to="/login">Login here.</Link>
        </div>
      </div>
      </div>
    </div> 
  );
};

export default withRouter(Register);