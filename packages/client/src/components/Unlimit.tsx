"use client";
import {
  GateFiDisplayModeEnum,
  GateFiLangEnum,
  GateFiSDK,
} from "@gatefi/js-sdk";
import { FC, useRef, useEffect, useState } from "react";
import crypto from "crypto";

const Unlimit: FC = () => {
  const instanceSDK = useRef<any>();
  const [cryptoWidget, setCryptoWidget] = useState(null);
  const [showIframe, setShowIframe] = useState(false); // state to control iframe visibility
  const [quotes, setQuotes] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);
  const [showApiResponse, setShowApiResponse] = useState(true);
  const [showQuotesResponse, setShowQuotesResponse] = useState(true);
  const [customOrderId, setCustomOrderId] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [singleOrderResponse, setSingleOrderResponse] = useState(null);
  const [showSingleOrderResponse, setShowSingleOrderResponse] = useState(false);
  const [config, setConfig] = useState(null);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("SDK and Hosted Flow"); // Default tab is "SDK and Hosted Flow"
  const [responseText, setResponseText] = useState<string | null>(null);
  const [showResponse, setShowResponse] = useState(false);

  const overlayInstanceSDK = useRef<GateFiSDK | null>(null);

  useEffect(() => {
    return () => {
      overlayInstanceSDK.current?.destroy();
      overlayInstanceSDK.current = null;
    };
  }, []);

  // State to hold the form values
  // Initial state for the form
  const [form, setForm] = useState({
    amount: "100",
    crypto: "ETH",
    fiat: "USD",
    partnerAccountId: "9e34f479-b43a-4372-8bdf-90689e16cd5b",
    payment: "BANKCARD",
    region: "US",
  });

  const [orderParams, setOrderParams] = useState({
    start: "2023-07-22",
    end: "2024-08-22",
    limit: "5",
    skip: "0",
  });

  // Event handler for custom order ID field
  const handleCustomOrderIdChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCustomOrderId(e.target.value);
  };

  // Event handler for wallet address field
  const handleWalletAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setWalletAddress(e.target.value);
  };

  let secretkey = "GSLDrYtqLmXDJRHbqtUwDQLwKBbEgPvu";
  let prodSecretkey = "xx";
  let webhookSecrerKey = "GrZvMWzQxSrKZIAaeCsBndQCRoZtiyVz";

  //string will be method + api path
  let dataVerify = "GET" + "/onramp/v1/configuration";
  let dataVerify1 = "GET" + "/onramp/v1/quotes";
  let dataVerify2 = "GET" + "/onramp/v1/orders";
  let dataVerify3 =
    "GET" +
    "/onramp/v1/orders/184f5c5a1c25fd89536a00b626e9f44a6decbe10ab806292ccd4e5a5e199b496";
  let dataVerify4 = "GET" + "/onramp/v1/buy";
  let GetOrdersPath = "GET" + "/onramp/v1/orders";

  function calcWebhookAuthSigHash(data: string) {
    const hmac = crypto.createHmac("sha256", webhookSecrerKey);
    hmac.update(data);
    return hmac.digest("hex");
  }

  const webhookHash = async () => {
    // Fetch data from the new webhook URL
    const webhookResponse = await fetch("/api/proxy?endpoint=/webhook-data");
    const responseJson = await webhookResponse.json(); // Assume the data is in JSON format

    // Ensure the data has the necessary structure before proceeding
    if (
      !responseJson.data ||
      responseJson.data.length === 0 ||
      !responseJson.data[0].headers ||
      !responseJson.data[0].headers["x-signature"]
    ) {
      console.error("Invalid data format received from webhook URL");
      return;
    }

    const receivedSignature = responseJson.data[0].headers["x-signature"][0]; // Extract the x-signature value from the first object in the data array
    const payloadString = responseJson.data[0].content; // Extract the content field which contains the payload data

    // Validate the received signature against the expected signature
    const expectedSignature = calcWebhookAuthSigHash(payloadString);

    if (receivedSignature === expectedSignature) {
      console.log("Signature is valid");
    } else {
      console.error("Invalid signature");
    }

    // The rest of your code follows...
    const response = await fetch("/api/hashWebhook", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-signature": expectedSignature, // Use the expectedSignature for validation on the server
      },
      body: payloadString,
    });

    const result = await response.text();
    console.log(result); // Log the response from your API route
    setResponseText(result);
    setShowResponse(true);
  };

  const closeResponse = () => {
    setShowResponse(false);
  };

  // Hash the secret key with the data
  function calcAuthSigHash(data: string, key: string) {
    const hmac = crypto.createHmac("sha256", key);
    hmac.update(data);
    return hmac.digest("hex");
  }

  // Hash the secret key with the data
  function calcAuthSigHashProd(data: string) {
    const hmac = crypto.createHmac("sha256", prodSecretkey);
    hmac.update(data);
    return hmac.digest("hex");
  }

  console.log("config prod prod config", calcAuthSigHashProd(dataVerify));

  // console.log('Quotes Sig Test', calcAuthSigHash(dataVerify1))
  // console.log(calcAuthSigHash(dataVerify2))
  console.log("get single order", calcAuthSigHashProd(dataVerify3));
  console.log("API BUY PROD", calcAuthSigHashProd(dataVerify4));
  console.log("QUOOOTES PROODDDD", calcAuthSigHashProd(dataVerify1));

  // console.log('Prod get quotes',calcAuthSigHashProd(dataVerify1))
  // console.log('Prod buy Asset',calcAuthSigHashProd(dataVerify4))
  // console.log('Config Prod',calcAuthSigHashProd(dataVerify))

  console.log("Config Prod", calcAuthSigHashProd(dataVerify));
  console.log("Get Orders Prod", calcAuthSigHashProd(GetOrdersPath));

  let signatureConfig = calcAuthSigHash(dataVerify, secretkey);
  let signature = calcAuthSigHash(dataVerify4, secretkey);
  let signature1 = calcAuthSigHash(dataVerify1, secretkey);
  let signature2 = calcAuthSigHash(dataVerify2, secretkey);
  let signature3 = calcAuthSigHash(dataVerify3, secretkey);
  let signatureBuyAssetProd = calcAuthSigHashProd(dataVerify4);

  let signatureQuotesProd = calcAuthSigHashProd(dataVerify1);

  const handleOrderParamChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrderParams({
      ...orderParams,
      [e.target.name]: e.target.value,
    });
  };

  const getConfig = async () => {
    const queryString = new URLSearchParams(form).toString();

    const response = await fetch(
      `/api/proxy?endpoint=/onramp/v1/configuration`,
      {
        method: "GET",
        headers: {
          "access-control-allow-headers": "Accept",
          signature: signatureConfig,
          "api-key": "VrHPdUXBsiGtIoWXTGrqqAwmFalpepUq",
        },
      }
    );
    const data = await response.json();
    setConfig(data);
  };

  const getOrders = async (params: string) => {
    const response = await fetch(
      `/api/proxy?endpoint=/onramp/v1/orders&${params}`,
      {
        method: "GET",
        redirect: "follow",
        headers: {
          "access-control-allow-headers": "Accept",
          signature: signature2,
          "api-key": "VrHPdUXBsiGtIoWXTGrqqAwmFalpepUq",
        },
      }
    );
    const data = await response.json();
    setApiResponse(data);
    setShowApiResponse(true); // Add this line
    return data;
  };

  const handleOrderFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(orderParams).toString();
    getOrders(params);
  };

  const getSingleOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let dataVerify3 = "GET" + `/onramp/v1/orders/${customOrderId}`;
    let signature3 = calcAuthSigHash(dataVerify3, secretkey);

    const response = await fetch(
      `/api/proxy?endpoint=/onramp/v1/orders/${customOrderId}&walletAddress=${walletAddress}`,
      {
        method: "GET",
        redirect: "follow",
        headers: {
          "access-control-allow-headers": "Accept",
          signature: signature3,
          "api-key": "VrHPdUXBsiGtIoWXTGrqqAwmFalpepUq",
        },
      }
    );
    const data = await response.json();
    setSingleOrderResponse(data);
    setShowSingleOrderResponse(true);
  };

  //TEST NET
  const getQuotes = async () => {
    // Build the URL query string from the form values
    const queryString = new URLSearchParams(form).toString();
    const response = await fetch(
      `/api/proxy?endpoint=/onramp/v1/quotes&${queryString}`,
      {
        method: "GET",
        redirect: "follow",
        headers: {
          "access-control-allow-headers": "Accept",
          signature: signature1,
          "api-key": "VrHPdUXBsiGtIoWXTGrqqAwmFalpepUq",
        },
      }
    );

    const data = await response.json(); // You probably want the JSON response, not the URL
    setQuotes(data);
    return data;
  };

  const buyAssetAPI = async () => {
    instanceSDK?.current?.show();

    const randomString = require("crypto").randomBytes(32).toString("hex");

    // Open a blank window immediately
    const newWindow = window.open("", "_blank");

    const response = await fetch(
      `/api/proxy?endpoint=/onramp/v1/buy&amount=21&crypto=ETH&fiat=USD&orderCustomId=${randomString}&partnerAccountId=9e34f479-b43a-4372-8bdf-90689e16cd5b&payment=BANKCARD&redirectUrl=https://www.citadel.com/&region=US&walletAddress=0xb43Ae6CC2060e31790d5A7FDAAea828681a9bB4B`,
      {
        redirect: "follow",
        headers: {
          "api-key": "VrHPdUXBsiGtIoWXTGrqqAwmFalpepUq",
          signature: signature,
        },
      }
    );

    console.log("Response Headers:", [...response.headers]);
    console.log("signature signature signature signature signature", signature);

    const externalApiUrl = response.headers.get("X-External-Api-Url");

    if (externalApiUrl && newWindow) {
      newWindow.location.href = externalApiUrl;
    } else if (response.ok) {
      const finalUrl = response.headers.get("X-Final-Url");
      if (finalUrl && newWindow) {
        newWindow.location.href = finalUrl;
      }
    } else {
      const data = await response.json();
      setCryptoWidget(data);
    }
  };

  // Handle form submission
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    getQuotes();
    setShowQuotesResponse(true);
  };

  // Handle form field changes
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  // 2. Use useEffect to call getQuotes when the component mounts
  useEffect(() => {
    getQuotes().then((data) => {
      // 3. Set the response to the quotes state variable
      setQuotes(data);
    });
  }, []);

  const handleOnClick = () => {
    if (overlayInstanceSDK.current) {
      if (isOverlayVisible) {
        overlayInstanceSDK.current.hide();
        setIsOverlayVisible(false);
      } else {
        overlayInstanceSDK.current.show();
        setIsOverlayVisible(true);
      }
    } else {
      const randomString = require("crypto").randomBytes(32).toString("hex");
      overlayInstanceSDK.current = new GateFiSDK({
        merchantId: "9e34f479-b43a-4372-8bdf-90689e16cd5b",
        displayMode: GateFiDisplayModeEnum.Overlay,
        nodeSelector: "#overlay-button",
        isSandbox: true,
        walletAddress: "0xb43Ae6CC2060e31790d5A7FDAAea828681a9bB4B",
        email: "test@tester.com",
        externalId: randomString,
        defaultFiat: {
          currency: "USD",
          amount: "64",
        },
        defaultCrypto: {
          currency: "ETH",
        },
      });
    }

    overlayInstanceSDK.current?.show();
    setIsOverlayVisible(true);
  };

  const handleOnClickProd = () => {
    if (overlayInstanceSDK.current) {
      if (isOverlayVisible) {
        overlayInstanceSDK.current.hide();
        setIsOverlayVisible(false);
      } else {
        overlayInstanceSDK.current.show();
        setIsOverlayVisible(true);
      }
    } else {
      const randomString = require("crypto").randomBytes(32).toString("hex");
      overlayInstanceSDK.current = new GateFiSDK({
        merchantId: "xxx",
        displayMode: GateFiDisplayModeEnum.Overlay,
        nodeSelector: "#overlay-button",
        email: "d.dadkhoo@unlimit.com",
        externalId: randomString,
        // region: "ES",
        defaultFiat: {
          currency: "USD",
          amount: "21",
        },
        defaultCrypto: {
          currency: "ETH",
        },
      });
    }

    overlayInstanceSDK.current?.show();
    setIsOverlayVisible(true);
  };

  // Function to create a new embed SDK instance

  const handleHostedFlowClick = () => {
    const url =
      "https://onramp-sandbox.gatefi.com/?merchantId=9e34f479-b43a-4372-8bdf-90689e16cd5b&lang=es_PE";
    window.open(url, "_blank");
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* <h2>Unlimit Crypto</h2> */}

        <div style={{ display: "flex" }}></div>

        {/* Content based on active tab */}

        <div
          style={{
            display: "block",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <div>
            <button onClick={handleOnClick}>Unlimit</button>

            {/* <button onClick={handleHostedFlowClick}>Hosted Flow</button> */}
            {/* <button onClick={handleOnClickProd}>Prod Overlay</button> */}
          </div>

          <div id="overlay-button"></div>
        </div>
      </div>
    </>
  );
};

export default Unlimit;
