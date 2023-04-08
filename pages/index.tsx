import Head from 'next/head'
import { useUser } from '@supabase/auth-helpers-react'
import { Container, Card, Row, Col, Text, Input } from '@nextui-org/react'

import Summary from '@/components/Summary'

export default function Home() {

  const user = useUser();

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        
        <Container>

          <Card css={{ bg: "$black", w: "100%" }}>
            <Card.Header css={{ position: "absolute", zIndex: 1, top: 5 }}>
              <Col>
                <Text size={12} weight="bold" transform="uppercase" color="#ffffffAA">
                  Plain and simple
                </Text>
                <Text h4 color="white">
                  Enter a URL and get summarized content
                </Text>
              </Col>
            </Card.Header>
            <Card.Image
              src="https://nextui.org/images/card-example-2.jpeg"
              alt="Enter a URL and get summarized content"
            />
          </Card>

        </Container>
        <Container>
          {user ? <Summary /> :
            <Card css={{ bg: "$black", h: "100vw" }}>
              <Card.Header>
                <Text>Authenticatoin required</Text>
              </Card.Header>
              <Card.Body>
                <Text>In order to use this service you need to log in first.</Text>
              </Card.Body>
            </Card>
          }
        </Container>

      </main>
    </>
  )
}
