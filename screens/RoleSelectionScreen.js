// screens/RoleSelectionScreen.js
import React from "react";
import { View, Button, Text } from "react-native";

export default function RoleSelectionScreen({ navigation }) {
	return (
		<View>
			<Text>Join as:</Text>
			<Button title="Seller" onPress={() => navigation.navigate("Login")} />
			<Button title="Buyer" onPress={() => navigation.navigate("Login")} />
		</View>
	);
}
