// import {
//   updateProfile,
//   updateEmail,
//   EmailAuthProvider,
//   reauthenticateWithCredential,
//   User,
// } from "firebase/auth";
// import {
//   doc,
//   setDoc,
//   getDoc,
//   updateDoc,
//   serverTimestamp,
// } from "firebase/firestore";
// import { db } from "../lib/firebase";

// export interface UserProfileData {
//   displayName?: string;
//   phone?: string;
//   address?: string;
//   city?: string;
//   postalCode?: string;
//   updatedAt?: any;
// }

// export interface UpdateProfileData extends UserProfileData {
//   email?: string;
// }

// // Get user profile from Firestore
// export const getUserProfile = async (
//   userId: string
// ): Promise<UserProfileData | null> => {
//   try {
//     const userDoc = await getDoc(doc(db, "users", userId));

//     if (userDoc.exists()) {
//       return userDoc.data() as UserProfileData;
//     }

//     return null;
//   } catch (error) {
//     console.error("Error getting user profile:", error);
//     return null;
//   }
// };

// // Update user profile in Firestore
// export const updateUserProfile = async (
//   userId: string,
//   profileData: UserProfileData
// ): Promise<void> => {
//   try {
//     const userRef = doc(db, "users", userId);

//     // Check if document exists
//     const userDoc = await getDoc(userRef);

//     if (userDoc.exists()) {
//       // Update existing document
//       await updateDoc(userRef, {
//         ...profileData,
//         updatedAt: serverTimestamp(),
//       });
//     } else {
//       // Create new document
//       await setDoc(userRef, {
//         ...profileData,
//         createdAt: serverTimestamp(),
//         updatedAt: serverTimestamp(),
//       });
//     }

//     console.log("User profile updated successfully");
//   } catch (error) {
//     console.error("Error updating user profile:", error);
//     throw new Error("Failed to update profile");
//   }
// };

// // Update Firebase Auth profile (displayName)
// export const updateAuthProfile = async (
//   user: User,
//   profileData: { displayName?: string }
// ): Promise<void> => {
//   try {
//     await updateProfile(user, {
//       displayName: profileData.displayName || null,
//     });

//     console.log("Auth profile updated successfully");
//   } catch (error) {
//     console.error("Error updating auth profile:", error);
//     throw new Error("Failed to update authentication profile");
//   }
// };

// // Update email (requires reauthentication)
// export const updateUserEmail = async (
//   user: User,
//   newEmail: string,
//   currentPassword: string
// ): Promise<void> => {
//   try {
//     // Reauthenticate user before changing email
//     const credential = EmailAuthProvider.credential(
//       user.email!,
//       currentPassword
//     );
//     await reauthenticateWithCredential(user, credential);

//     // Update email
//     await updateEmail(user, newEmail);

//     console.log("Email updated successfully");
//   } catch (error: any) {
//     console.error("Error updating email:", error);

//     if (error.code === "auth/wrong-password") {
//       throw new Error("Pogrešna lozinka");
//     } else if (error.code === "auth/email-already-in-use") {
//       throw new Error("Email adresa se već koristi");
//     } else if (error.code === "auth/invalid-email") {
//       throw new Error("Nevaljan format email adrese");
//     }

//     throw new Error("Failed to update email");
//   }
// };

// // Complete profile update (combines Auth and Firestore updates)
// export const updateCompleteProfile = async (
//   user: User,
//   profileData: UpdateProfileData,
//   currentPassword?: string
// ): Promise<void> => {
//   try {
//     const promises: Promise<void>[] = [];

//     // Update displayName in Firebase Auth
//     if (
//       profileData.displayName &&
//       profileData.displayName !== user.displayName
//     ) {
//       promises.push(
//         updateAuthProfile(user, { displayName: profileData.displayName })
//       );
//     }

//     // Update email if changed and password provided
//     if (
//       profileData.email &&
//       profileData.email !== user.email &&
//       currentPassword
//     ) {
//       promises.push(updateUserEmail(user, profileData.email, currentPassword));
//     }

//     // Update profile in Firestore
//     const firestoreData: UserProfileData = {
//       displayName: profileData.displayName,
//       phone: profileData.phone,
//       address: profileData.address,
//       city: profileData.city,
//       postalCode: profileData.postalCode,
//     };

//     promises.push(updateUserProfile(user.uid, firestoreData));

//     // Execute all updates
//     await Promise.all(promises);

//     console.log("Complete profile update successful");
//   } catch (error) {
//     console.error("Error in complete profile update:", error);
//     throw error;
//   }
// };

import {
  updateProfile,
  updateEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
  User,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";

export interface UserProfileData {
  displayName?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  updatedAt?: any;
}

export interface UpdateProfileData extends UserProfileData {
  email?: string;
}

// Get user profile from Firestore
export const getUserProfile = async (
  userId: string
): Promise<UserProfileData | null> => {
  try {
    // PROMENIO SA "users" NA "Users" da se slaže sa ostalim servisima
    const userDoc = await getDoc(doc(db, "Users", userId));

    if (userDoc.exists()) {
      return userDoc.data() as UserProfileData;
    }

    return null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
};

// Update user profile in Firestore
export const updateUserProfile = async (
  userId: string,
  profileData: UserProfileData
): Promise<void> => {
  try {
    // PROMENIO SA "users" NA "Users" da se slaže sa ostalim servisima
    const userRef = doc(db, "Users", userId);

    // Check if document exists
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      // Update existing document
      await updateDoc(userRef, {
        ...profileData,
        updatedAt: serverTimestamp(),
      });
    } else {
      // Create new document
      await setDoc(userRef, {
        ...profileData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    console.log("User profile updated successfully");
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw new Error("Failed to update profile");
  }
};

// Update Firebase Auth profile (displayName)
export const updateAuthProfile = async (
  user: User,
  profileData: { displayName?: string }
): Promise<void> => {
  try {
    await updateProfile(user, {
      displayName: profileData.displayName || null,
    });

    console.log("Auth profile updated successfully");
  } catch (error) {
    console.error("Error updating auth profile:", error);
    throw new Error("Failed to update authentication profile");
  }
};

// Update email (requires reauthentication)
export const updateUserEmail = async (
  user: User,
  newEmail: string,
  currentPassword: string
): Promise<void> => {
  try {
    // Reauthenticate user before changing email
    const credential = EmailAuthProvider.credential(
      user.email!,
      currentPassword
    );
    await reauthenticateWithCredential(user, credential);

    // Update email
    await updateEmail(user, newEmail);

    console.log("Email updated successfully");
  } catch (error: any) {
    console.error("Error updating email:", error);

    if (error.code === "auth/wrong-password") {
      throw new Error("Pogrešna lozinka");
    } else if (error.code === "auth/email-already-in-use") {
      throw new Error("Email adresa se već koristi");
    } else if (error.code === "auth/invalid-email") {
      throw new Error("Nevaljan format email adrese");
    }

    throw new Error("Failed to update email");
  }
};

// Complete profile update (combines Auth and Firestore updates)
export const updateCompleteProfile = async (
  user: User,
  profileData: UpdateProfileData,
  currentPassword?: string
): Promise<void> => {
  try {
    const promises: Promise<void>[] = [];

    // Update displayName in Firebase Auth
    if (
      profileData.displayName &&
      profileData.displayName !== user.displayName
    ) {
      promises.push(
        updateAuthProfile(user, { displayName: profileData.displayName })
      );
    }

    // Update email if changed and password provided
    if (
      profileData.email &&
      profileData.email !== user.email &&
      currentPassword
    ) {
      promises.push(updateUserEmail(user, profileData.email, currentPassword));
    }

    // Update profile in Firestore
    const firestoreData: UserProfileData = {
      displayName: profileData.displayName,
      phone: profileData.phone,
      address: profileData.address,
      city: profileData.city,
      postalCode: profileData.postalCode,
    };

    promises.push(updateUserProfile(user.uid, firestoreData));

    // Execute all updates
    await Promise.all(promises);

    console.log("Complete profile update successful");
  } catch (error) {
    console.error("Error in complete profile update:", error);
    throw error;
  }
};
