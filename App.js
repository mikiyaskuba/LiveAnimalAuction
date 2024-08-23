import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import SellerScreen from "./screens/SellerScreen";
import BuyerScreen from "./screens/BuyerScreen";
import HomeScreen from "./screens/HomeScreen";
import MessageScreen from "./screens/MessageScreen";
import { getPersistedAuthState } from "./authPersistence";

const Stack = createStackNavigator();

export default function App() {
	useEffect(() => {
		const checkAuthState = async () => {
			const user = await getPersistedAuthState();
			if (user) {
				// Handle already authenticated user (e.g., navigate to Home or other screen)
			}
		};

		checkAuthState();
	}, []);

	return (
		<NavigationContainer>
			<Stack.Navigator initialRouteName="Signup">
				<Stack.Screen name="Login" component={LoginScreen} />
				<Stack.Screen name="Signup" component={SignupScreen} />
				<Stack.Screen name="Seller" component={SellerScreen} />
				<Stack.Screen name="Buyer" component={BuyerScreen} />
				<Stack.Screen name="Home" component={HomeScreen} />
				<Stack.Screen name="Message" component={MessageScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}
