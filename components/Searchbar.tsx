"use client";

import { scrapeAndStoreProduct } from "@/lib/actions";
import { FormEvent, useState } from "react";

import { useRouter } from "next/navigation";

const isValidAmaazonProductURL = (url: string) => {
  try {
    const parsedURL = new URL(url);
    const hostname = parsedURL.hostname;

    if (
      hostname.includes("amazon.com") ||
      hostname.includes("amazon.") ||
      hostname.includes("amazon")
    ) {
      return true;
    }
  } catch (error) {
    return false;
  }
  return false;
};

const Searchbar = ({}) => {
  const router = useRouter();
  const [searchPrompt, setsearchPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isValidLink = isValidAmaazonProductURL(searchPrompt);

    if (!isValidLink) return alert("Pleas provide a valid Amazon link!");

    try {
      setIsLoading(true);
      const product = await scrapeAndStoreProduct(searchPrompt);
      router.push(`/products/${product._id}`);
    } catch (error) {
      console.log(error);
    } finally {
     
      setIsLoading(false);
    }
  };

  return (
    <form className="flex flex-wrap gap-4 mt-12" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter amazon product link"
        className="searchbar-input"
        value={searchPrompt}
        onChange={(e) => setsearchPrompt(e.target.value)}
      />
      <button
        type="submit"
        className="searchbar-btn"
        disabled={searchPrompt === ""}
      >
        {isLoading ? "Searching..." : "Search"}
      </button>
    </form>
  );
};

export default Searchbar;