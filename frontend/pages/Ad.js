import Image from 'next/image';
import Head from 'next/head';
import Nav from '../components/Nav';
import Intro from '../components/Intro';
import styles from '../styles/Home.module.css';
import Chatter from '../components/Chatter';
import Footer from '../components/Footer';
import Advertiser from '../components/Advertiser';

export default function Ad() {
  return (
    <div className="bg-black h-screen w-full ">
      <Head>
      <title>Talking NFT</title>
      <meta name="description" content="Created at Outer Edge Hackerthon LA" />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <Nav />
    <div className="flex flex-col items-center justify-center h-screen">
      <button
        className={`bg-donut hover:bg-yellow-600 rounded-full px-12 py-2 text-black font-bold mb-5`}
      >
        Start advertising
      </button>
      <button
        className={`bg-donut hover:bg-yellow-600 rounded-full px-12 py-2 text-black font-bold`}
      >
        Stop stream
      </button>
    </div>
    </div>
  );
}
