import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [companyName, setCompanyName] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyName,
          companyDescription,
          productDescription,
          targetAudience,
        }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result.split("\n\n"));
     
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>MIA - Marketing Ideation App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>MIA - Marketing Ideation App</h1>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="companyName"
            placeholder="Company Name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
          <input
            type="text"
            name="companyDescription"
            placeholder="Company Description"
            value={companyDescription}
            onChange={(e) => setCompanyDescription(e.target.value)}
          />
          <input
            type="text"
            name="productDescription"
            placeholder="Product Description"
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
          />
          <input
            type="text"
            name="targetAudience"
            placeholder="Target Audience"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
          />
          <input type="submit" value="Generate" />
        </form>
        <div className={styles.result}>{result && result.map((campaign, index) => (
                <div className={styles.campaign} key={index}>
                  <pre>{campaign}</pre>
                </div>
              ))}</div>
      </main>
    </div>
  );
}
