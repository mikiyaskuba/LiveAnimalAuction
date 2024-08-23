import React, { useState } from "react";
import {
	View,
	TextInput,
	Button,
	Text,
	Alert,
	Image,
	StyleSheet,
} from "react-native";
import { auth, db } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import img from '../assets/oxTrade.jpeg'
export default function SignupScreen({ navigation }) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [role, setRole] = useState(""); // Track the selected role
	const [name, setName] = useState(""); // Track the user's name

	const handleSignup = async () => {
		if (!role) {
			Alert.alert("Error", "Please select a role (Seller or Buyer)");
			return;
		}

		if (!name) {
			Alert.alert("Error", "Please enter your name");
			return;
		}

		try {
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			const user = userCredential.user;

			// Save the user's role (seller or buyer) and name to Firestore
			await setDoc(doc(db, "users", user.uid), {
				role: role,
				email: email, // Optionally store the user's email
				name: name, // Save the user's name
			});

			// Navigate to the appropriate screen based on the role
			if (role === "seller") {
				navigation.navigate("Seller");
			} else if (role === "buyer") {
				navigation.navigate("Home");
			}
		} catch (error) {
			Alert.alert("Error", error.message);
		}
	};

	return (
		<View style={styles.container}>
			<Image
				source={ img } // Replace with your image URL
				style={styles.image}
			/>
			<View style={styles.card}>
				<Text style={styles.title}>Sign Up</Text>
				<TextInput
					placeholder="Name"
					value={name}
					onChangeText={setName}
					style={styles.input}
				/>
				<TextInput
					placeholder="Email"
					value={email}
					onChangeText={setEmail}
					autoCapitalize="none"
					keyboardType="email-address"
					style={styles.input}
				/>
				<TextInput
					placeholder="Password"
					value={password}
					onChangeText={setPassword}
					secureTextEntry
					style={styles.input}
				/>
				<View style={styles.roleSelection}>
					<Text>Select Role:</Text>
					<View style={styles.buttonContainer}>
						<Button
							title="Seller"
							color={role === "seller" ? "blue" : "gray"}
							onPress={() => setRole("seller")}
						/>
						<Button
							title="Buyer"
							color={role === "buyer" ? "blue" : "gray"}
							onPress={() => setRole("buyer")}
						/>
					</View>
				</View>
				<Button title="Sign Up" onPress={handleSignup} />
				<Button
					title="Login"
					onPress={() => navigation.navigate("Login")}
					color="gray"
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
		backgroundColor: "#f0f0f0", // Soft background color
	},
	image: {
		width: 200,
		height: 200,
		marginBottom: 20,
		borderRadius: 100,
	},
	card: {
		width: "100%",
		padding: 20,
		borderRadius: 15,
		backgroundColor: "rgba(255, 255, 255, 0.6)", // Glassmorphism effect
		borderColor: "rgba(255, 255, 255, 0.3)",
		borderWidth: 1,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 10 },
		shadowOpacity: 0.1,
		shadowRadius: 20,
		elevation: 5,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		textAlign: "center",
		marginBottom: 20,
	},
	input: {
		borderWidth: 1,
		borderColor: "#ccc",
		padding: 10,
		borderRadius: 8,
		marginBottom: 15,
		backgroundColor: "#fff",
	},
	roleSelection: {
		marginVertical: 10,
	},
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
});
