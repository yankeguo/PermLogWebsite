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
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col pt-8">
    <div class="flex flex-row justify-between">
      <div class="font-semibold text-3xl">Permlog</div>

      <w3m-button />
    </div>
  </div>
</template>
