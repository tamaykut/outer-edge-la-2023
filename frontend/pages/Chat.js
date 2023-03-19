import Image from 'next/image';
import Head from 'next/head';
import Nav from '../components/Nav';
import Intro from '../components/Intro';
import styles from '../styles/Home.module.css';
import Chatter from '../components/Chatter';
import Footer from '../components/Footer';

export default function Chat() {
  return (
    <div>
      <Head>
        <title>Talking NFT</title>
        <meta name="description" content="Created at Outer Edge Hackerthon LA" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Nav />
      <Chatter classname="flex mx-auto"/>
      <Footer/>
    </div>
  );
}
