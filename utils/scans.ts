import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "SCANS_SKANEO";

export type ScanItem = {
 id: string;
 data: string;
 date: number;
};

export async function getScans(): Promise<ScanItem[]> {
 const raw = await AsyncStorage.getItem(KEY);
 return raw ? JSON.parse(raw) : [];
}

export async function saveScan(data: string) {
 const scans = await getScans();

 const newScan: ScanItem = {
  id: Date.now().toString(),
  data,
  date: Date.now(),
 };

 const updated = [newScan, ...scans];

 await AsyncStorage.setItem(KEY, JSON.stringify(updated));

 return updated;
}

export async function clearScans() {
 await AsyncStorage.removeItem(KEY);
}