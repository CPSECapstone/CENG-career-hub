"use client";
import { Bookmark } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import "./bookmark-button.css";

interface BookmarkProps {
  postId: number;
  initialState: boolean;
}

export default function BookmarkButton({
  postId,
  initialState = false,
}: BookmarkProps) {
  const [isSaved, setIsSaved] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    if (isLoading) return; // prevent double-clicks while saving

    // save initial value in case of errors
    const previousState = isSaved;
    const nextState = !isSaved;

    // immediately update UI while handling save functionality
    setIsSaved(nextState);
    setIsLoading(true);

    try {
      const supabase = createClient();

      // get current user
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error("You must be signed in to save posts.");
      }

      if (nextState) {
        // add new bookmark
        const { error } = await supabase
          .from("saved_opportunities")
          .insert({ user_id: user.id, opportunity_id: postId });
        if (error) throw error;
      } else {
        // delete saved post
        const { error } = await supabase
          .from("saved_opportunities")
          .delete()
          .eq("user_id", user.id)
          .eq("opportunity_id", postId);
        if (error) throw error;
      }
    } catch (error) {
      // revert bookmark to original state if DB fails
      console.error(error);
      setIsSaved(previousState);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className={`bookmark ${isSaved ? "saved" : ""}`}
      type="button"
      onClick={handleToggle}
      disabled={isLoading}
    >
      <Bookmark size={19} />
    </button>
  );
}
