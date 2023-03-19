import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Nav from "../components/Nav";
import Intro from "../components/Intro";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Talking NFT</title>
        <meta name="description" content="Created at Outer Edge Hackerthon LA" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Nav />
      <Intro />
    </div>
  );
}
