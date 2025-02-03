import * as Yup from "yup";

export const signupValidation = Yup.object({
  fullName: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),

  email: Yup.string().email("Invalid email").required("Required"),

  companyName: Yup.string()
    .min(2, "Too Short!")
    .max(100, "Too Long!")
    .required("Required"),

  branchCount: Yup.number().min(1, "Must be at least 1").required("Required"),

  users: Yup.number().min(1, "Must be at least 1").required("Required"),

  phone: Yup.string().required("Required"), // Optional: Add regex for phone validation if needed
});
