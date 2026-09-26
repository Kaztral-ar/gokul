(() => {
  const coins = [
    ["BTC", "bitcoin", "₿"],
    ["ETH", "ethereum", "◆"],
    ["DOGE", "dogecoin", "Ð"],
    ["USDT", "tether", "₮"],
    ["SOL", "solana", "◎"],
    ["BNB", "binancecoin", "◈"],
    ["ADA", "cardano", "₳"],
    ["XRP", "ripple", "●"]
  ];

  const setA = document.getElementById("cryptoSetA");
  const setB = document.getElementById("cryptoSetB");
  const status = document.getElementById("cryptoStatus");

  const formatPrice = (value) => {
    if (value >= 1000) {
      return "$" + value.toLocaleString("en-US", {
        maximumFractionDigits: 0
      });
    }

    if (value >= 1) {
      return "$" + value.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    }

    return "$" + value.toLocaleString("en-US", {
      minimumFractionDigits: 4,
      maximumFractionDigits: 6
    });
  };

  function render(data) {
    const html = coins
      .map(([symbol, id, icon]) => {
        const coin = data[id];

        if (!coin) {
          return "";
        }

        const change = Number(
          coin.usd_24h_change || 0
        );

        const cls = change >= 0 ? "up" : "down";
        const sign = change >= 0 ? "+" : "";

        return `<span class="crypto-item">
          <span class="crypto-symbol">
            ${icon} ${symbol}
          </span>
          <span class="crypto-price">
            ${formatPrice(coin.usd)}
          </span>
          <span class="crypto-change ${cls}">
            ${sign}${change.toFixed(2)}%
          </span>
        </span>`;
      })
      .join("");

    setA.innerHTML = html;
    setB.innerHTML = html;
    status.textContent = "Live prices · updates every 60s";
  }

  async function updateCrypto() {
    try {
      const ids = coins
        .map(([, id]) => id)
        .join(",");

      const url =
        `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;

      const response = await fetch(url, {
        cache: "no-store"
      });

      if (!response.ok) {
        throw new Error("Crypto API unavailable");
      }

      render(await response.json());
    } catch (error) {
      status.textContent = "Crypto prices unavailable";
    }
  }

  updateCrypto();

  setInterval(updateCrypto, 60000);
})();
