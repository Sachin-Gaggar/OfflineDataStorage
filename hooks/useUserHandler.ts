import { useNetworkStatus } from "@/components/NetworkStatusContext";
import AllStrings from "@/constants/AllStrings";
import {
  fetchUserData,
  selectUserData,
  selectUserFetchError,
  selectUserLoader,
  updateError,
  updateLoader,
  updateUserState,
} from "@/service/user";
import { AppDispatch } from "@/store";
import { deleteUserFromDB, getAllUsers, updateUser } from "@/store/userDB";
import { User } from "@/types/User";
import { useEffect, useCallback } from "react";
import { Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const useUserHandler = () => {
  const { isConnected } = useNetworkStatus();
  const dispatch = useDispatch<AppDispatch>();
  const userData = useSelector(selectUserData);
  const error = useSelector(selectUserFetchError);
  const loading = useSelector(selectUserLoader);

  useEffect(() => {
    if (isConnected && !userData) {
      dispatch(fetchUserData());
    } else if (!isConnected) {
      getUsersFromDB();
    }
  }, [isConnected, userData, dispatch]);

  const getUsersFromDB = useCallback(async () => {
    try {
      const allUser = await getAllUsers();
      if (allUser.length) {
        dispatch(updateUserState(allUser));
      } else {
        dispatch(updateError(AllStrings.databaseEmpty));
      }
    } catch (err) {
      dispatch(updateError(err instanceof Error ? err.message : String(err)));
    }
  }, [dispatch]);

  const editUsers = useCallback(
    async (editedUser: User) => {
      dispatch(updateLoader());
      try {
        await updateUser(editedUser);
        await getUsersFromDB();
      } catch (err) {
        dispatch(updateError(err instanceof Error ? err.message : String(err)));
      }
    },
    [dispatch, getUsersFromDB]
  );

  const deleteUser = useCallback(
    async (id: number) => {
      dispatch(updateLoader());
      try {
        await deleteUserFromDB(id);
        await getUsersFromDB();
      } catch (err) {
        dispatch(updateError(err instanceof Error ? err.message : String(err)));
      }
    },
    [dispatch, getUsersFromDB]
  );

  useEffect(() => {
    if (error) {
      Alert.alert(AllStrings.somethingWentWrong, error, [{ text: "ok" }]);
    }
  }, [error]);

  return {
    userData,
    error,
    loading,
    editUsers,
    deleteUser,
  } as const;
};

export default useUserHandler;
