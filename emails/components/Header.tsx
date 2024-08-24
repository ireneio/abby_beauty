import React from "react";
import { MjmlColumn, MjmlGroup, MjmlSection, MjmlWrapper } from "@faire/mjml-react";
import Text from "./Text";
import Link from "./Link";
import { colors, fontSize, lineHeight, fontWeight } from "../theme";

export default function Header() {
  return (
    <MjmlWrapper padding="40px 0 64px" backgroundColor={colors.black}>
      <MjmlSection cssClass="gutter">
        <MjmlGroup>
          <MjmlColumn width="42%">
            <Text align="left">
              <Link
                color={colors.white}
                fontSize={fontSize.xl}
                fontWeight={fontWeight.bold}
                href={`https://abby-beauty.vercel.app`}
                textDecoration="none"
              >
                <img
                  height={24}
                  width={112}
                  src={`https://abby-beauty.vercel.app/images/logo.png`}
                  alt=""
                  style={{
                    verticalAlign: "text-bottom",
                    paddingRight: 10,
                    paddingBottom: 2,
                  }}
                />
              </Link>
            </Text>
          </MjmlColumn>
          <MjmlColumn cssClass="h-full" width="58%">
            <Text
              align="right"
              fontSize={fontSize.xs}
              lineHeight={lineHeight.tight}
              fontWeight={fontWeight.bold}
            >
              克麗緹娜
              <br />
              艾比美容工作室
            </Text>
          </MjmlColumn>
        </MjmlGroup>
      </MjmlSection>
    </MjmlWrapper>
  );
}
