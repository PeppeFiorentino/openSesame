import { parse } from "https://deno.land/std/flags/mod.ts";

const DELAY = 1500;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function knock(host: string, port: number) {
  console.log("Knocking port: ", port);
  const options = { hostname: host, port: port };
  Deno.connect(options).catch(() => null);
  return sleep(DELAY);
}

const myargs = parse(Deno.args, { default: { h: "localhost" } });
if (myargs.v || myargs.V || myargs.version) {
  console.log("openSesame - versione 1.0");
  Deno.exit();
}

const chain = myargs._.reduce((acc, port) => {
  return acc.then(() => knock(myargs.h, port as number));
}, Promise.resolve());

chain.then(() => sleep(4 * DELAY)).then(() => Deno.exit());
