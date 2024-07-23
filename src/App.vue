<script setup lang="ts">
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Button from "primevue/button";

import { isAddress } from "web3-validator";
import { Base64 } from "js-base64";

import { onMounted, ref } from "vue";
import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/vue";
import { abi } from "./PermLog.json";

import { gnosis } from "viem/chains";
import { reconnect, verifyMessage, writeContract } from "@wagmi/core";

const projectId = "a43f0c40b9d631837c164d361959ace2";

const valAddress = ref("");
const errAddress = ref("");
const valKind = ref("");
const errKind = ref("");
const valName = ref("");
const errName = ref("");
const valContent = ref("");
const errContent = ref("");
const valSubmitHash = ref("");

const regexpForBytes32 = /^[ -~]{1,16}$/;

onMounted(async () => {
  const address = localStorage.getItem("contract-address");
  if (address && isAddress(address)) {
    valAddress.value = address;
  }
});

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

function toHex(bytes: Uint8Array): `0x${string}` {
  return ("0x" +
    Array.from(bytes)
      .map((x) => x.toString(16).padStart(2, "0"))
      .join("")) as `0x${string}`;
}

function stringToBytes32(s: string): `0x${string}` {
  const buf = new Uint8Array(32).fill(0);
  const enc = new TextEncoder().encode(s).slice(0, 32);
  buf.set(enc);
  return toHex(buf);
}

function urlForGnosisTx(txHash: string): string {
  return `https://gnosis.blockscout.com/tx/${txHash}?tab=logs`;
}

async function submit() {
  let bad = false;

  if (isAddress(valAddress.value)) {
    errAddress.value = "";
    localStorage.setItem("contract-address", valAddress.value);
  } else {
    errAddress.value = "Invalid address";
    bad = true;
  }
  if (!regexpForBytes32.test(valKind.value)) {
    errKind.value = "Invalid kind, should be 1-16 ASCII characters";
    bad = true;
  } else {
    errKind.value = "";
  }
  if (!regexpForBytes32.test(valName.value)) {
    errName.value = "Invalid name, should be 1-16 ASCII characters";
    bad = true;
  } else {
    errName.value = "";
  }
  let rawContent: Uint8Array = new Uint8Array(0);
  try {
    rawContent = Base64.toUint8Array(valContent.value);
  } catch (e) {}
  if (rawContent.length === 0) {
    errContent.value = "Invalid content, should be base64 encoded";
    bad = true;
  } else {
    errContent.value = "";
  }

  if (bad) {
    return;
  }

  const address = valAddress.value as `0x${string}`;
  const kind = stringToBytes32(valKind.value);
  const name = stringToBytes32(valName.value);
  const content = toHex(rawContent);

  const txHash = await writeContract(wagmiConfig, {
    abi,
    address,
    functionName: "log",
    args: [kind, name, content],
  });

  valSubmitHash.value = txHash;

  valContent.value = "";
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col pt-8 gap-8">
    <div class="flex flex-row justify-between">
      <div class="font-semibold text-3xl">Permlog</div>
      <w3m-button />
    </div>
    <div class="flex flex-col gap-4">
      <label class="font-semibold">Gnosis PermLog Contract Address</label>
      <InputText
        class="ring ring-1 rounded ring-slate-400"
        size="small"
        v-model="valAddress"
        placeholder="0xaAbBcCdD..."
      />
      <span v-if="errAddress" class="text-red-400">{{ errAddress }}</span>
      <label class="font-semibold">Log Kind (1-16 ASCII Characters)</label>
      <InputText
        class="ring ring-1 rounded ring-slate-400"
        size="small"
        v-model="valKind"
        placeholder="recovery-code"
      />
      <span v-if="errKind" class="text-red-400">{{ errKind }}</span>
      <label class="font-semibold">Log Name (1-16 ASCII Characters)</label>
      <InputText
        class="ring ring-1 rounded ring-slate-400"
        size="small"
        v-model="valName"
        placeholder="github"
      />
      <span v-if="errName" class="text-red-400">{{ errName }}</span>
      <label class="font-semibold"
        >Log Content (Base64 Encoded Arbitrary Data)</label
      >
      <Textarea v-model="valContent" rows="12"></Textarea>
      <span v-if="errContent" class="text-red-400">{{ errContent }}</span>
      <Button @click="submit" label="Submit Log"></Button>
      <div v-if="valSubmitHash" class="text-green-600">
        <span> Transaction Submitted, </span>
        <a class="underline font-semibold" :href="urlForGnosisTx(valSubmitHash)"
          >Click to View</a
        >
      </div>
    </div>
  </div>
</template>
