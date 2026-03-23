"use client";

import dynamic from "next/dynamic";
import "../../src/index.css"; // We'll import their Tailwind v4 setup + custom CSS here

const App = dynamic(() => import("../../src/App"), { ssr: false });

export default function CatchAll() {
  return <App />;
}
