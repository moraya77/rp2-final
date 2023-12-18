// this is a javascript file
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://ugxxwqkbmydiecspnhgo.supabase.co";
const supabaseAnonKey =
 "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVneHh3cWtibXlkaWVjc3BuaGdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk2MjI4MDgsImV4cCI6MjAxNTE5ODgwOH0._Ux1M0hvh0-KL5h1XpTKqe5QRKHay2Rl2nERMzrj6uQ";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
 auth: {

   storage: AsyncStorage,
   autoRefreshToken: true,
   persistSession: true,
   detectSessionInUrl: false,
 },
});