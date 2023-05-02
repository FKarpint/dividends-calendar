const express = require('express');
const axios = require('axios');
const cors = require('cors');
const myStocks = require('./stocks.json');

const app = express();
app.use(cors());

const FINNHUB_API="";
const STOCK_UNLOCK_BASE_URL = 'https://api.stockunlock.com';
const FINNHUB_API_URL ="https://finnhub.io/api/v1/stock/profile2?token="+FINNHUB_API;

app.get('/dividends', async (req, res) => {
  const month = req.query.month;
  const year = req.query.year;

  try {
    var responseData = [];
    var id=0;
    for (const item of myStocks) {
      const response = await axios.get(`${STOCK_UNLOCK_BASE_URL}/stockDetails/getTickerOverview?ticker=${item.stock}`);
      const imgData = await axios.get(`${FINNHUB_API_URL}&symbol=${item.stock}`);
      //EX-DATE
      responseData.push({
        id,
        url: `https://stockunlock.com/stockDetails/${item.stock}/general`,
        title: "EX-D:" + response.data.companyData.ticker,
        time: { start: response.data.dividendData.exDividendDate, end: response.data.dividendData.exDividendDate },
        description: response.data.companyData.name,
        image: imgData.data.logo,
        tags: "#"+response.data.companyData.industry,
        location: response.data.companyData.homeExchange,
      });
      id += 1;
      //PaymentDate - payDate
      responseData.push({
        id,
        url: `https://stockunlock.com/stockDetails/${item.stock}/general`,
        title: "PAY:" + response.data.companyData.ticker,
        time: { start: response.data.dividendData.payDate, end: response.data.dividendData.payDate },
        description: response.data.companyData.name,
        image: imgData.data.logo,
        tags: "#"+response.data.companyData.industry,
        location: response.data.companyData.homeExchange,
      });
      id += 1;
      //Eranings - payDate
      responseData.push({
        id,
        url: `https://stockunlock.com/stockDetails/${item.stock}/general`,
        title: "EARNS:" + response.data.companyData.ticker,
        time: { start: "2023-"+response.data.shareStatsData.nextEarningsDate, end: "2023-"+response.data.shareStatsData.nextEarningsDate },
        description: response.data.companyData.name,
        image: imgData.data.logo,
        tags: "#"+response.data.companyData.industry,
        location: response.data.companyData.homeExchange,
      });
      id += 1;
    }
   console.log(responseData);
    res.json(responseData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));