import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { User } from "@/types/User";
import { addUser } from "@/store/userDB";
import AllStrings from "@/constants/AllStrings";
import { useDispatch } from "react-redux";
import { useRouter } from "expo-router";
import { updateNewUser } from "@/service/user";

interface AddUserProps {
  onSubmit: (
    user: Omit<User, "id" | "creationAt" | "updatedAt" | "avatar">
  ) => void;
}

const AddUser: React.FC<AddUserProps> = ({ onSubmit }) => {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    password: "",
    role: "" as "customer" | "admin",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const dispatch = useDispatch();
  const router = useRouter();

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors = { name: "", email: "", password: "", role: "" };
    if (!formState.name.trim()) {
      newErrors.name = AllStrings.nameError;
      isValid = false;
    }

    if (!formState.email.trim()) {
      newErrors.email = AllStrings.mailError;
      isValid = false;
    } else if (!formState.email.includes("@")) {
      newErrors.email = AllStrings.validEmail;
      isValid = false;
    }

    if (!formState.password.trim()) {
      newErrors.password = AllStrings.passwordError;
      isValid = false;
    }

    if (!formState.role) {
      newErrors.role = AllStrings.roleError;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (field: keyof typeof formState, value: string) => {
    setFormState((prevState) => ({ ...prevState, [field]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      const newUser = await addUser(formState);
      dispatch(updateNewUser(newUser));
      router.back();
    }
  };

  const clearForm = () => {
    setFormState({
      name: "",
      email: "",
      password: "",
      role: "customer",
    });
    setErrors({ name: "", email: "", password: "", role: "" });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add User</Text>

      <TextInput
        style={[styles.input, errors.name && styles.errorInput]}
        placeholder="Name"
        value={formState.name}
        onChangeText={(value) => handleChange("name", value)}
      />
      {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}

      <TextInput
        style={[styles.input, errors.email && styles.errorInput]}
        placeholder="Email"
        value={formState.email}
        onChangeText={(value) => handleChange("email", value)}
        keyboardType="email-address"
      />
      {errors.email ? (
        <Text style={styles.errorText}>{errors.email}</Text>
      ) : null}

      <TextInput
        style={[styles.input, errors.password && styles.errorInput]}
        placeholder="Password"
        value={formState.password}
        onChangeText={(value) => handleChange("password", value)}
        secureTextEntry
      />
      {errors.password ? (
        <Text style={styles.errorText}>{errors.password}</Text>
      ) : null}

      <View style={styles.roleSelector}>
        <TouchableOpacity
          style={[
            styles.roleButton,
            formState.role === "customer" && styles.selectedRole,
          ]}
          onPress={() => handleChange("role", "customer")}
        >
          <Text style={styles.roleText}>{AllStrings.customer}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.roleButton,
            formState.role === "admin" && styles.selectedRole,
          ]}
          onPress={() => handleChange("role", "admin")}
        >
          <Text style={styles.roleText}>{AllStrings.admin}</Text>
        </TouchableOpacity>
      </View>
      {errors.role ? <Text style={styles.errorText}>{errors.role}</Text> : null}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>{AllStrings.addUser}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddUser;
const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  errorInput: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 8,
  },
  roleSelector: {
    flexDirection: "row",
    marginBottom: 16,
  },
  roleButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#aaa",
    alignItems: "center",
    marginHorizontal: 4,
  },
  selectedRole: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  roleText: {
    color: "#ffffff",
  },
  submitButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  submitText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
