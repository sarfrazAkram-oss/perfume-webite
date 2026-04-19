import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore, initializeFirestore } from "firebase/firestore";

export const firebaseWebConfig = {
  apiKey: "AIzaSyCOWPZhRPkZlHMTgZCToPvxdCgPStNRwHM",
  authDomain: "perfume-webite.firebaseapp.com",
  projectId: "perfume-webite",
  storageBucket: "perfume-webite.firebasestorage.app",
  messagingSenderId: "35597806107",
  appId: "1:35597806107:web:72b774a93a659bc58326be",
  measurementId: "G-TW9C5392LB",
};

export const firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseWebConfig);

// Auto-detect long-polling avoids hanging requests on restricted networks.
export const firestoreDb = (() => {
  try {
    return initializeFirestore(firebaseApp, {
      experimentalAutoDetectLongPolling: true,
      ignoreUndefinedProperties: true,
    });
  } catch {
    return getFirestore(firebaseApp);
  }
})();

export async function getFirebaseAnalytics() {
  if (typeof window === "undefined") {
    return null;
  }

  const analyticsModule = await import("firebase/analytics");

  if (!(await analyticsModule.isSupported())) {
    return null;
  }

  return analyticsModule.getAnalytics(firebaseApp);
}
