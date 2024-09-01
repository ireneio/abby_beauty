import { ColumnType, Generated } from "kysely";

export interface WebSetting {
    id: Generated<number>;
    logo_square: ColumnType<string, string, string | undefined>,
    logo_rect: ColumnType<string, string, string | undefined>,
    company_email: ColumnType<string, string, string | undefined>,
    company_phone: ColumnType<string, string, string | undefined>,
    company_address: ColumnType<string, string, string | undefined>,
    company_lineid: ColumnType<string, string, string | undefined>,
    copyright_text: ColumnType<string, string, string | undefined>,
    info_about_us: ColumnType<string, string, string | undefined>,
    info_hint: ColumnType<string, string, string | undefined>,
    website_title: ColumnType<string, string, string | undefined>,
    website_description: ColumnType<string, string, string | undefined>,
    site_name: ColumnType<string, string, string | undefined>,
}
