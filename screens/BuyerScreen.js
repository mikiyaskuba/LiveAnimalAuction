// screens/BuyerScreen.js
import React from "react";
import { View, Button, Text } from "react-native";

export default function BuyerScreen({ navigation }) {
	return (
		<View>
			<Text>Welcome, Buyer!</Text>
			<Button
				title="View Cattle Posts"
				onPress={() => navigation.navigate("Home")}
			/>
		</View>
	);
}
