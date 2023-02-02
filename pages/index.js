import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import Loading from "../components/Loading";
import Error from "../components/Error";
import Image from "next/image";

export default function Home() {
  const [codeInput, setCodeInput] = useState("");
  const [result, setResult] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event) {
    event.preventDefault();
    try {
      setError("");
      setLoading(true);
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: codeInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      setResult(data.result);
      setCodeInput("");
      setLoading(false);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/comp.png" />
      </Head>

      <main className={styles.main}>
        <Image src="/comp.png" width={75} height={75} alt="logo" />
        <h3>What's Your Time Complexity?</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="code"
            placeholder="Paste Code Here"
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value)}
          />
          <input type="submit" value="Check" />
        </form>
        <div className={styles.result}>{loading ? <Loading /> : result}</div>
      </main>
    </div>
  );
}
