import axios from "axios";
import * as cheerio from "cheerio";
import { extractPrice } from "../utils";

export async function scrapeAmazonProduct(url: string) {
  if (!url) return;

  // curl --proxy brd.superproxy.io:22225 --proxy-user
  // brd - customer - hl_a97215b5 - zone - pricewise: yt13g4xsxixf - k "http://lumtest.com/myip.json"

  const username = String(process.env.BRINGHT_DATA_USERNAME);
  const password = String(process.env.BRINGHT_DATA_PASSWORD);
  const port = 22225;
  const session_id = (1000000 * Math.random()) | 0;

  const options = {
    auth: {
      username: `${username}-session-${session_id}`,
      password,
    },
    host: "brd.superproxy.io",
    port,
    rejectUnauthorized: false,
  };

  try {
    // ответ страницы продукта
    const response = await axios.get(url, options);
    const $ = cheerio.load(response.data);

    // выделение цены
    const title = $("#productTitle").text().trim();
    const currentPrice = extractPrice(
      $(".priceToPay span.a-price-whole"),
      $(".a.size.base.a-color-price"),
      $(".a-button-selected .a-color-base"),
      $("span.a-offscreen")
      );
      
      const originalPrice = extractPrice(
          $('#priceblock_ourprice'),
          $('.a-price.a-text-price span.a-offscreen')
      )

    console.log({ title, currentPrice });
  } catch (error: any) {
    throw new Error(`Failed to scrape product: ${error.message}`);
  }
}
