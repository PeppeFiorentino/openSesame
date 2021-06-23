import { parse } from "https://deno.land/std/flags/mod.ts";

const DELAY = 1000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function knock(host,port) {
  console.log("Knocking port: ", port);
  const options = { hostname: host };
  options.port = port;
  Deno.connect(options).catch(() => null);
  return sleep(DELAY);
}

const myargs = parse(Deno.args,{default:{h:"localhost"}});
if (myargs.v || myargs.V || myargs.version) {
  console.log("openSesame - versione 1.0");
  Deno.exit();
}

myargs._.reduce((acc,port)=>{return acc.then(()=>knock("localhost",port));},Promise.resolve());


