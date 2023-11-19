export const model = [
  {
    role: "system",
    content:
      "Extract the tokens involved, protocol, parameters and their values in one line from the following commands:  example : swap .01eth to usdc\n\nAssume any suitable protocol like  Sushiswap, AAVE, etc when not mentioned and from the protocols code, figure out which function is being executed\n    Return the response in the following format-protocol:{{protocol}}\\ntokens:[token1, token2, ..etc]\\nfunction:{{function(param1, param2, ..etc)}}\\nvalues:[value1,value2,etc]\n\n    For example for the intent : I want to swap WMATIC for 0.00001USDC, the response would be strictly in the following json format:\n{\n    protocol:Sushiswap\n    tokens:[WMATIC, USDC]\n    function:swapExactTokensForTokens(amountIn, amountOutMin, path, to, deadline)\n    values:[0.0001]\n}\n\n    For example for the intent : I want to borrow 0.00001 USDT, the response would be strictly in the following json format:\n{\n    protocol:AAVE\n    tokens:[USDT]\n    function:borrow(_asset, _amount, _interestRateMode, _referralCode, _onBehalfOf)\n    values:[0.0001]\n}\n\n    For example for the intent : I want to repay 0.00001 USDT, the response would be strictly in the following json format:\n{\n    protocol:AAVE\n    tokens:[USDT]\n    function:repay(_asset, _amount, _rateMode, _onBehalfOf)\n    values:[0.0001]\n}\n\nFor example for the intent : get my aviral.lens profile,  the response would be strictly in the following json format:\nfunction : getProfile\nvalues : aviral.lens\n\nFor example for the intent : Hey cat, can you update your dynamic NFT background? ,  the response would be strictly in the following json format:\n\n{\nfunction : updateBg\n}\n\nFor example for the intent :  can you update your dynamic NFT background? ,  the response would be strictly in the following json format:\n\n{\nfunction : updateBg\n}\n\n\n",
  },
  {
    role: "user",
    content: "send 1 eth to 0xA815663337FAbA23637A28A60FE3CeC51603f397",
  },
  {
    role: "assistant",
    content:
      'protocol:\ntokens:[ETH]\nfunction:transfer(to, value)\nvalues:["0xA815663337FAbA23637A28A60FE3CeC51603f397", "1"]',
  },
  {
    role: "user",
    content: "who is vaitalik?\n",
  },
  {
    role: "assistant",
    content:
      "Perhaps you meant to ask about Vitalik Buterin. Vitalik Buterin is a Russian-Canadian programmer and one of the co-founders of Ethereum, a blockchain platform. He is well-known for his contributions to the development of Ethereum and his role as a prominent figure in the cryptocurrency industry.",
  },
  {
    role: "user",
    content: "send 1 eth to vaitalik.eth",
  },
  {
    role: "assistant",
    content:
      'protocol:Ethereum\ntokens:[ETH]\nfunction:transfer(to, value)\nvalues:["vaitalik.eth", "1"]',
  },
  {
    role: "user",
    content: "swap eth for 35 usdc",
  },
  {
    role: "assistant",
    content:
      "protocol:Sushiswap\ntokens:[ETH, USDC]\nfunction:swapExactETHForTokens(amountOutMin, path, to, deadline)\nvalues:[35, [ETH, USDC]]",
  },
  {
    role: "user",
    content: "get my aviral.lens profile",
  },
  {
    role: "assistant",
    content: "function:getProfile\nvalues:aviral.lens",
  },
  {
    role: "user",
    content: "Hey cat, can you change your dynamic NFT background?\n",
  },
  {
    role: "assistant",
    content: "function:updateBg",
  },
];
