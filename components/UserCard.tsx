import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import AllStrings from "@/constants/AllStrings";
import { User } from "@/types/User";

const UserCard = ({
  item,
  editUser,
  deleteUser,
}: {
  item: User;
  deleteUser: Function;
  editUser: Function;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: item.name,
    email: item.email,
  });
  const [errors, setErrors] = useState({ name: "", email: "" });

  const handleFieldChange = (
    field: keyof typeof userDetails,
    value: string
  ) => {
    setUserDetails((prev) => ({ ...prev, [field]: value }));
  };

  const validateFields = () => {
    let isValid = true;
    let newErrors = { name: "", email: "" };
    if (!userDetails.name.trim()) {
      newErrors.name = "Name is required.";
      isValid = false;
    }
    if (!userDetails.email.trim()) {
      newErrors.email = "Email is required.";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleBlur = (field: keyof typeof userDetails) => {
    if (!userDetails[field].trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } is required.`,
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: "",
      }));
    }
  };

  const onEditPress = () => {
    if (isEditing) {
      if (validateFields()) {
        editUser({ ...item, ...userDetails });
        setIsEditing(false);
      }
    } else {
      setIsEditing(true);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.infoContainer}>
        {isEditing ? (
          <>
            <TextInput
              style={[styles.input, errors.name ? styles.errorInput : null]}
              value={userDetails.name}
              onChangeText={(text) => handleFieldChange("name", text)}
              onBlur={() => handleBlur("name")}
              placeholder="Enter name"
            />
            {errors.name ? (
              <Text style={styles.errorText}>{errors.name}</Text>
            ) : null}

            <TextInput
              style={[styles.input, errors.email ? styles.errorInput : null]}
              value={userDetails.email}
              onChangeText={(text) => handleFieldChange("email", text)}
              onBlur={() => handleBlur("email")}
              placeholder="Enter email"
              keyboardType="email-address"
            />
            {errors.email ? (
              <Text style={styles.errorText}>{errors.email}</Text>
            ) : null}
          </>
        ) : (
          <>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.email}>{item.email}</Text>
          </>
        )}
        <Text style={styles.role}>
          {AllStrings.role}: {item.role}
        </Text>
      </View>

      <View style={styles.row}>
        <TouchableOpacity onPress={onEditPress}>
          <Text style={styles.actionText}>
            {isEditing ? AllStrings.save : AllStrings.edit}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteUser(item.id)}>
          <Text style={[styles.actionText, styles.deleteText]}>
            {AllStrings.delete}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default React.memo(UserCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  infoContainer: {
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  email: {
    fontSize: 14,
    color: "#6b6b6b",
  },
  role: {
    fontSize: 14,
    color: "#007AFF",
  },
  row: {
    flexDirection: "row",
    marginTop: 12,
    justifyContent: "space-between",
  },
  actionText: {
    fontSize: 16,
    color: "#007AFF",
  },
  deleteText: {
    color: "red",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
    marginBottom: 4,
  },
  errorInput: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
  },
});
