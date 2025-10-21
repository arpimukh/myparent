import { useState } from 'react'
import Head from 'next/head'
import Hero from '../components/Home/Hero'
import About from '../components/Home/About'
import Services from '../components/Home/Services'
import Contact from '../components/Home/Contact'

export default function Home() {
  return (
    <>
      <Head>
        <title>Parent Care Services - Compassionate Care at Home</title>
        <meta name="description" content="Professional parent care services providing comprehensive support for your loved ones" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <Hero />
      <About />
      <Services />
      <Contact />
    </>
  )
}