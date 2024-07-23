<script setup lang="ts">
import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/vue";

import { gnosis } from "viem/chains";
import { reconnect } from "@wagmi/core";

const projectId = "a43f0c40b9d631837c164d361959ace2";

const metadata = {
  name: "Permlog",
  description: "Permanent log on the blockchain",
  url: "https://permlog.yankeguo.com",
  icons: ["https://permlog.yankeguo.com/favicon.ico"],
};

const wagmiConfig = defaultWagmiConfig({
  chains: [gnosis],
  projectId,
  metadata,
});

reconnect(wagmiConfig);

createWeb3Modal({
  wagmiConfig,
  projectId,
  enableAnalytics: true,
  enableOnramp: true,
});
</script>

<template>
  <w3m-button />
</template>
