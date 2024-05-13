import axios from "axios";
import * as cheerio from "cheerio";
import { extractCurrency, extractDescription, extractDiscountRate, extractPrice } from "../utils";

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
      $("#priceblock_ourprice"),
      $(".a-price.a-text-price span.a-offscreen"),
      $("#listP"),
      $("#priceblock_dealprice"),
      $(".a-size-base.a-color-price")
    );

    const outOfStock =
      $("#availability span").text().trim().toLowerCase() ===
      "currently unavailable";

    const images =
      $("#imgBlkFront").attr("data-a-dynamic-image") ||
      $("#landingImage").attr("data-a-dynamic-image") ||
      '{}'    
    const imageUrls = Object.keys(JSON.parse(images));

    const currency = extractCurrency($('.a-price-symbol'));
    const discountRate = extractDiscountRate($(".savingsPercentage"));

    const description = extractDescription($)

    console.log({ title, currentPrice, originalPrice, outOfStock,  imageUrls, currency, discountRate});

    //dataObj with scraped info of product

    const data = {
      url,
      currency: currency || '$',
      image: imageUrls[0],
      title,
      currentPrice: Number(currentPrice) || Number(originalPrice),
      originalPrice: Number(originalPrice) || Number(currentPrice),
      priceHistory: [],
      discountRate: Number(discountRate),
      category: 'category',
      reviewsCount: 100,
      stars: 4.5,
      isOutOfStock: outOfStock,
      description,
      lowerPrice: Number(currentPrice) || Number(originalPrice), 
      highesPrice: Number(originalPrice) || Number(currentPrice),
      average: Number(currentPrice) || Number(originalPrice),
    }

    console.log(data);

    return data;

  } catch (error: any) {
    throw new Error(`Failed to scrape product: ${error.message}`);
  }
}
