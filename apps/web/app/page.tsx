"use client";

import { useEffect, useState } from "react";
import { client } from "../kurre/client";

export default function Home() {
  const [data, setData] = useState();

  // useEffect(() => {
  //   async function f() {
  //     const data2 = await client.queryExample.query({
  //       input: { name: "Jee" },
  //     });
  //     setData(data2);
  //   }
  //   f();
  // }, []);
  return (
    <main>
      <h1>Hello World</h1>
      {JSON.stringify(data)}
    </main>
  );
}
