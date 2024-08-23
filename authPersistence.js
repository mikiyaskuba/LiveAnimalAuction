// authPersistence.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import { onAuthStateChanged } from "firebase/auth";

export const persistAuthState = (auth) => {
	onAuthStateChanged(auth, async (user) => {
		if (user) {
			// Save user details to AsyncStorage
			await AsyncStorage.setItem("user", JSON.stringify(user));
		} else {
			// Remove user details from AsyncStorage
			await AsyncStorage.removeItem("user");
		}
	});
};

export const getPersistedAuthState = async () => {
	const user = await AsyncStorage.getItem("user");
	return user ? JSON.parse(user) : null;
};
