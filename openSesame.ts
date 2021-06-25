import { parse } from "https://deno.land/std/flags/mod.ts";

const DELAY = 4000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function knock(host: string, port: number) {
  console.log("Knocking port: ", port);
  host = "http://" + host;
  const url = new URL(host);
  url.port = port.toString();
  url.protocol = "TCP";
  const c = new AbortController();
  fetch(url, { signal: c.signal }).catch(() => null);
  await sleep(DELAY);
  c.abort();
}

const myargs = parse(Deno.args, { default: { h: "localhost" } });
if (myargs.v || myargs.V || myargs.version) {
  console.log("openSesame - versione 1.0");
  Deno.exit();
}

const chain = myargs._.reduce((acc, port) => {
  return acc.then(() => knock(myargs.h, port as number));
}, Promise.resolve());
