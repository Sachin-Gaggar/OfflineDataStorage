import {
  ActivityIndicator,
  Button,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { router, Stack, useRouter } from "expo-router";
import AllStrings from "@/constants/AllStrings";
import useUserHandler from "@/hooks/useUserHandler";
import { User } from "@/types/User";
import UserCard from "@/components/UserCard";

const index = () => {
  const { userData, loading, error, deleteUser, editUsers } = useUserHandler();

  if (loading === "loading") {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }
  // We are also showing alert in error inside the handler
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }
  return (
    <>
      <Stack.Screen options={{ headerTitle: AllStrings.User }} />

      <FlatList
        data={userData}
        extraData={userData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <UserCard editUser={editUsers} deleteUser={deleteUser} item={item} />
        )}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={
          <TouchableOpacity
            style={styles.addUserButton}
            onPress={() => router.navigate("/AddUser")}
          >
            <Text style={styles.addUserText}>Add User</Text>
          </TouchableOpacity>
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>{AllStrings.empty}</Text>
        }
      />
    </>
  );
};

export default index;

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
  },
  emptyText: {
    textAlign: "center",
    color: "#6b6b6b",
    fontSize: 16,
  },
  addUserButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    alignSelf: "center",
    marginVertical: 20,
  },
  addUserText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
