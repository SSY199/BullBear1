// lib/actions/watchlist.actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
// Make sure these are in your .env file!
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use the service key for secure server actions
);

export async function toggleWatchlist(userId: string, symbol: string, companyName: string) {
  try {
    // 1. Check if the stock is already in the user's watchlist
    const { data: existingItem } = await supabase
      .from("watchlist")
      .select("id")
      .eq("user_id", userId)
      .eq("symbol", symbol)
      .single();

    if (existingItem) {
      // 2. If it exists, Remove it
      const { error } = await supabase
        .from("watchlist")
        .delete()
        .eq("id", existingItem.id);
        
      if (error) throw error;

      revalidatePath(`/stocks/${symbol}`);
      return { success: true, message: "Removed from Watchlist", isWatched: false };
      
    } else {
      // 3. If it doesn't exist, Add it
      const { error } = await supabase
        .from("watchlist")
        .insert([{ 
          user_id: userId, 
          symbol: symbol, 
          company_name: companyName 
        }]);

      if (error) throw error;

      revalidatePath(`/stocks/${symbol}`);
      return { success: true, message: "Added to Watchlist", isWatched: true };
    }
  } catch (error) {
    console.error("Error toggling watchlist:", error);
    return { success: false, message: "Failed to update watchlist" };
  }
}

export async function checkIsWatched(userId: string, symbol: string) {
  try {
    const { data } = await supabase
      .from("watchlist")
      .select("id")
      .eq("user_id", userId)
      .eq("symbol", symbol)
      .single();

    return !!data; // Returns true if data exists, false if null
  } catch (error) {
    console.error("Error checking watchlist status:", error);
    return false;
  }
}