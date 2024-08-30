// import React, { useState } from "react";
// import {
// 	View,
// 	TextInput,
// 	Button,
// 	Text,
// 	Alert,
// 	Image,
// 	StyleSheet,
// } from "react-native";
// import { auth, db } from "../firebaseConfig";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { doc, setDoc } from "firebase/firestore";
// import img from '../assets/oxTrade.jpeg'
// export default function SignupScreen({ navigation }) {
// 	const [email, setEmail] = useState("");
// 	const [password, setPassword] = useState("");
// 	const [role, setRole] = useState(""); // Track the selected role
// 	const [name, setName] = useState(""); // Track the user's name

// 	const handleSignup = async () => {
// 		if (!role) {
// 			Alert.alert("Error", "Please select a role (Seller or Buyer)");
// 			return;
// 		}

// 		if (!name) {
// 			Alert.alert("Error", "Please enter your name");
// 			return;
// 		}

// 		try {
// 			const userCredential = await createUserWithEmailAndPassword(
// 				auth,
// 				email,
// 				password
// 			);
// 			const user = userCredential.user;

// 			// Save the user's role (seller or buyer) and name to Firestore
// 			await setDoc(doc(db, "users", user.uid), {
// 				role: role,
// 				email: email, // Optionally store the user's email
// 				name: name, // Save the user's name
// 			});

// 			// Navigate to the appropriate screen based on the role
// 			if (role === "seller") {
// 				navigation.navigate("Seller");
// 			} else if (role === "buyer") {
// 				navigation.navigate("Home");
// 			}
// 		} catch (error) {
// 			Alert.alert("Error", error.message);
// 		}
// 	};

// 	return (
// 		<View style={styles.container}>
// 			<Image
// 				source={ img } // Replace with your image URL
// 				style={styles.image}
// 			/>
// 			<View style={styles.card}>
// 				<Text style={styles.title}>Sign Up</Text>
// 				<TextInput
// 					placeholder="Name"
// 					value={name}
// 					onChangeText={setName}
// 					style={styles.input}
// 				/>
// 				<TextInput
// 					placeholder="Email"
// 					value={email}
// 					onChangeText={setEmail}
// 					autoCapitalize="none"
// 					keyboardType="email-address"
// 					style={styles.input}
// 				/>
// 				<TextInput
// 					placeholder="Password"
// 					value={password}
// 					onChangeText={setPassword}
// 					secureTextEntry
// 					style={styles.input}
// 				/>
// 				<View style={styles.roleSelection}>
// 					<Text>Select Role:</Text>
// 					<View style={styles.buttonContainer}>
// 						<Button
// 							title="Seller"
// 							color={role === "seller" ? "blue" : "gray"}
// 							onPress={() => setRole("seller")}
// 						/>
// 						<Button
// 							title="Buyer"
// 							color={role === "buyer" ? "blue" : "gray"}
// 							onPress={() => setRole("buyer")}
// 						/>
// 					</View>
// 				</View>
// 				<Button title="Sign Up" onPress={handleSignup} />
// 				<Button
// 					title="Login"
// 					onPress={() => navigation.navigate("Login")}
// 					color="gray"
// 				/>
// 			</View>
// 		</View>
// 	);
// }

// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		justifyContent: "center",
// 		alignItems: "center",
// 		padding: 20,
// 		backgroundColor: "#f0f0f0", // Soft background color
// 	},
// 	image: {
// 		width: 200,
// 		height: 200,
// 		marginBottom: 20,
// 		borderRadius: 100,
// 	},
// 	card: {
// 		width: "100%",
// 		padding: 20,
// 		borderRadius: 15,
// 		backgroundColor: "rgba(255, 255, 255, 0.6)", // Glassmorphism effect
// 		borderColor: "rgba(255, 255, 255, 0.3)",
// 		borderWidth: 1,
// 		shadowColor: "#000",
// 		shadowOffset: { width: 0, height: 10 },
// 		shadowOpacity: 0.1,
// 		shadowRadius: 20,
// 		elevation: 5,
// 	},
// 	title: {
// 		fontSize: 24,
// 		fontWeight: "bold",
// 		textAlign: "center",
// 		marginBottom: 20,
// 	},
// 	input: {
// 		borderWidth: 1,
// 		borderColor: "#ccc",
// 		padding: 10,
// 		borderRadius: 8,
// 		marginBottom: 15,
// 		backgroundColor: "#fff",
// 	},
// 	roleSelection: {
// 		marginVertical: 10,
// 	},
// 	buttonContainer: {
// 		flexDirection: "row",
// 		justifyContent: "space-between",
// 	},
// });
import React, { useState } from "react";
import {
	View,
	TextInput,
	TouchableOpacity,
	Text,
	Alert,
	StyleSheet,
	Image,
	ScrollView,
} from "react-native";
import { auth, db } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import img from "../assets/images (1).jpeg";

export default function SignupScreen({ navigation }) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [adminCode, setAdminCode] = useState("");
	const [name, setName] = useState("");

	const handleSignup = async () => {
		if (!email || !password || !confirmPassword || !name) {
			Alert.alert("Error", "Please fill out all fields");
			return;
		}

		if (password !== confirmPassword) {
			Alert.alert("Error", "Passwords do not match");
			return;
		}

		try {
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			const user = userCredential.user;

			const isAdmin = adminCode === "your_secret_code"; // Replace with your desired code

			await setDoc(doc(db, "users", user.uid), {
				name: name,
				email: user.email,
				isAdmin: isAdmin,
			});

			navigation.navigate("Home");
		} catch (error) {
			Alert.alert("Signup Failed", error.message);
		}
	};

	return (
		<ScrollView contentContainerStyle={styles.container}>
			<Image source={img} style={styles.image} />
			<View style={styles.card}>
				<Text style={styles.title}>Create an Account</Text>
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
				<TextInput
					placeholder="Confirm Password"
					value={confirmPassword}
					onChangeText={setConfirmPassword}
					secureTextEntry
					style={styles.input}
				/>
				<TextInput
					placeholder="Admin Code (if applicable)"
					value={adminCode}
					onChangeText={setAdminCode}
					secureTextEntry
					style={styles.input}
				/>
				<TouchableOpacity style={styles.button} onPress={handleSignup}>
					<Text style={styles.buttonText}>Sign Up</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={() => navigation.navigate("Login")}>
					<Text style={styles.link}>Already have an account? Login</Text>
				</TouchableOpacity>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#f2f2f2",
		paddingHorizontal: 20,
	},
	image: {
		width: 120,
		height: 120,
		marginBottom: 20,
		borderRadius: 60,
	},
	card: {
		width: "100%",
		maxWidth: 400,
		padding: 20,
		borderRadius: 20,
		backgroundColor: "#fff",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 10 },
		shadowOpacity: 0.1,
		shadowRadius: 20,
		elevation: 5,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 20,
		textAlign: "center",
		color: "#333",
	},
	input: {
		height: 50,
		borderColor: "#ddd",
		borderWidth: 1,
		borderRadius: 10,
		paddingHorizontal: 15,
		marginBottom: 15,
		backgroundColor: "#f9f9f9",
		fontSize: 16,
	},
	button: {
		backgroundColor: "#4e9af1",
		paddingVertical: 15,
		borderRadius: 10,
		alignItems: "center",
		marginBottom: 15,
	},
	buttonText: {
		color: "#fff",
		fontSize: 18,
		fontWeight: "bold",
	},
	link: {
		color: "#1e90ff",
		fontSize: 16,
		textAlign: "center",
	},
});
// import React, { useState } from "react";
// import {
//   View,
//   TextInput,
//   Button,
//   Text,
//   Alert,
//   StyleSheet,
//   TouchableOpacity,
//   Image,
//   ScrollView,
// } from "react-native";
// import { auth, db } from "../firebaseConfig";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { setDoc, doc } from "firebase/firestore";
// import img from "../assets/images (1).jpeg";

// export default function SignupScreen({ navigation }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [adminCode, setAdminCode] = useState(""); // Secret code to create an admin
//   const [name, setName] = useState(""); // Track the user's name

//   const handleSignup = async () => {
//     if (!email || !password || !confirmPassword || !name) {
//       Alert.alert("Error", "Please fill out all fields");
//       return;
//     }

//     if (password !== confirmPassword) {
//       Alert.alert("Error", "Passwords do not match");
//       return;
//     }

//     try {
//       const userCredential = await createUserWithEmailAndPassword(
//         auth,
//         email,
//         password
//       );
//       const user = userCredential.user;

//       // Determine if the user is an admin
//       const isAdmin = adminCode === "your_secret_code"; // Replace with your desired code

//       // Save user data in Firestore
//       await setDoc(doc(db, "users", user.uid), {
//         name: name,
//         email: user.email,
//         isAdmin: isAdmin,
//       });

//       navigation.navigate("Home");
//     } catch (error) {
//       Alert.alert("Signup Failed", error.message);
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Image source={img} style={styles.image} />
//       <View style={styles.card}>
//         <Text style={styles.title}>Sign Up</Text>
//         <TextInput
//           placeholder="Name"
//           value={name}
//           onChangeText={setName}
//           style={styles.input}
//         />
//         <TextInput
//           placeholder="Email"
//           value={email}
//           onChangeText={setEmail}
//           autoCapitalize="none"
//           keyboardType="email-address"
//           style={styles.input}
//         />
//         <TextInput
//           placeholder="Password"
//           value={password}
//           onChangeText={setPassword}
//           secureTextEntry
//           style={styles.input}
//         />
//         <TextInput
//           placeholder="Confirm Password"
//           value={confirmPassword}
//           onChangeText={setConfirmPassword}
//           secureTextEntry
//           style={styles.input}
//         />
//         <TextInput
//           placeholder="Admin Code (if applicable)"
//           value={adminCode}
//           onChangeText={setAdminCode}
//           secureTextEntry
//           style={styles.input}
//         />
//         <TouchableOpacity style={styles.button} onPress={handleSignup}>
//           <Text style={styles.buttonText}>Sign Up</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate("Login")}>
//           <Text style={styles.loginButtonText}>Already have an account? Log In</Text>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     padding: 20,
//     backgroundColor: "#e0f7fa",
//   },
//   input: {
//     height: 50,
//     borderColor: "#00796b",
//     borderWidth: 1,
//     borderRadius: 10,
//     paddingHorizontal: 15,
//     marginBottom: 20,
//     backgroundColor: "#ffffff",
//   },
//   button: {
//     backgroundColor: "#00796b",
//     paddingVertical: 15,
//     borderRadius: 10,
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   buttonText: {
//     color: "#ffffff",
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   card: {
//     width: "100%",
//     padding: 20,
//     borderRadius: 15,
//     backgroundColor: "rgba(255, 255, 255, 0.9)",
//     borderColor: "rgba(0, 0, 0, 0.1)",
//     borderWidth: 1,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 5 },
//     shadowOpacity: 0.3,
//     shadowRadius: 10,
//     elevation: 5,
//   },
//   image: {
//     width: 200,
//     height: 200,
//     marginBottom: 20,
//     alignSelf: "center",
//     borderRadius: 100,
//     borderWidth: 2,
//     borderColor: "#00796b",
//   },
//   title: {
//     fontSize: 30,
//     fontWeight: "bold",
//     marginBottom: 20,
//     textAlign: "center",
//     color: "#00796b",
//   },
//   loginButton: {
//     marginTop: 10,
//     alignItems: "center",
//   },
//   loginButtonText: {
//     color: "#00796b",
//     fontSize: 16,
//   },
// });
