import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import SellerScreen from "./screens/SellerScreen";
import BuyerScreen from "./screens/BuyerScreen";
import HomeScreen from "./screens/HomeScreen";
import MessageScreen from "./screens/MessageScreen";
import AdminDashboard from "./screens/AdminDashboard.jsx";
 // Ensure this path is correct
import { getPersistedAuthState } from "./authPersistence";

const Stack = createStackNavigator();

export default function App() {
	const [initialRoute, setInitialRoute] = useState("Login");

	useEffect(() => {
		const checkAuthState = async () => {
			const user = await getPersistedAuthState();
			if (user) {
				setInitialRoute(user.isAdmin ? "AdminDashboard" : "Home");
			} else {
				setInitialRoute("Login");
			}
		};

		checkAuthState();
	}, []);

	return (
		<NavigationContainer>
			<Stack.Navigator initialRouteName={initialRoute}>
				<Stack.Screen name="Login" component={LoginScreen} />
				<Stack.Screen name="Signup" component={SignupScreen} />
				<Stack.Screen name="Seller" component={SellerScreen} />
				<Stack.Screen name="Buyer" component={BuyerScreen} />
				<Stack.Screen name="Home" component={HomeScreen} />
				<Stack.Screen name="Message" component={MessageScreen} />
				<Stack.Screen
					name="AdminDashboard"
					component={AdminDashboard}
					options={{ title: "Admin Dashboard" }}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
}
