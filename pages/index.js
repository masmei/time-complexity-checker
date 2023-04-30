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
  const [error, setError] = useState(false);
  const [complexity, setComplexity] = useState("Time");
  // const [prevInput, setPrevInput] = ("")

  async function sendRequest(event) {
    event.preventDefault();
    console.log(complexity);
    try {
      setError("");
      setLoading(true);
      const response = await fetch(`/api/generate${complexity}`, {
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
      setLoading(false);
    } catch (error) {
      console.error(error);
      setError(true);
    }
  }

  const handleComplexity = (value) => {
    setComplexity(value)
    setResult("")
  }

  return (
    <div>
      <Head>
        <title>Complexity Calculator</title>
        <link rel="icon" href="/comp.png" />
      </Head>

      <main className={styles.main}>
        <Image src="/comp.png" width={75} height={75} alt="logo" />
        <h3>What's Your {complexity} Complexity?</h3>
        <div>
          <button
            onClick={(e) => handleComplexity(e.target.value)}
            className={styles.button}
            value= "Time"
          >
            Time
          </button>
          <button
            onClick={(e) => handleComplexity(e.target.value)}
            className={styles.button}
            value= "Space"
          >
            Space
          </button>
        </div>
        <form onSubmit={sendRequest}>
          <textarea
            rows={3}
            cols={50}
            name="code"
            placeholder="Paste Code Here"
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value)}
          />
          <input type="submit" value="Check" />
        </form>
        {error ? (
          <div className={styles.error}>
            <Error />
          </div>
        ) : (
          <div className={styles.result}>{loading ? <Loading /> : result}</div>
        )}
      </main>
    </div>
  );
}
