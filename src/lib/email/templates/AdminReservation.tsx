import {
  Html,
  Body,
  Head,
  Heading,
  Hr,
  Container,
  Preview,
  Section,
  Text,
} from "@react-email/components";

import { Tailwind } from "@react-email/tailwind";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function AdminReservation({ message }: any) {
    return (
      <Html>
        <Head />
        <Preview>艾比美容工作室 | 體驗課程預約通知</Preview>
        <Tailwind>
          <Body className="text-black">
            <Header />
            <Container>
              <Section className="bg-white borderBlack my-10 px-10 py-4 rounded-md">
                <Heading>預約人資訊</Heading>
                <Text>體驗的課程: {message.trial_name}</Text>
                <Hr />
                <Text>姓名: {message.name}</Text>
                <Hr />
                <Text>Email: {message.email}</Text>
                <Hr />
                <Text>聯絡電話: {message.phone}</Text>
                <Hr />
                <Text>LINE ID: {message.line_id}</Text>
                <Hr />
                <Text>想預約的日期: {message.date}</Text>
                <Hr />
                <Text>方便聯繫的時段: {message.time_of_day}</Text>
              </Section>
            </Container>
            <Footer />
          </Body>
        </Tailwind>
      </Html>
    )
}