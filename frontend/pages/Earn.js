import Image from 'next/image';
import Head from 'next/head';
import Nav from '../components/Nav';
import Intro from '../components/Intro';
import styles from '../styles/Home.module.css';
import Chatter from '../components/Chatter';
import Footer from '../components/Footer';
import Advertiser from '../components/Advertiser';

export default function Earn() {
  return (
    <div>
      <Head>
        <title>Earn from advertising</title>
        <meta name="description" content="Created at Outer Edge Hackerthon LA" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Nav />
      <Advertiser classname="flex mx-auto"/>
      <Footer/>
    </div>
  );
}
