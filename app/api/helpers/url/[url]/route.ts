import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { load } from 'cheerio';

export async function GET(
    req: NextRequest,
    { params }: { params: { url: string } }
) {    
    const { url } = params; // Automatically URL Decoded

    // TODO: Validate URL
    // const urlRegexExpression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
    // var urlRegex = new RegExp(urlRegexExpression);
    if (!url || typeof url !== 'string') {
        return NextResponse.json({ error: "Invalid URL or URL format provided" }, { status: 400 });
    }

    const urlTitle = await axios({
        method: "get",
        url: url,
        headers: {"Access-Control-Allow-Origin": "*"}
    })
    .then((res) => {
        return res.data;
    })
    .then((html) => {
        const $ = load(html);
        const title = $("title").text();
        return title;
    })
    .catch((error) => {
        return "Untitled";
    })

    return NextResponse.json({title: urlTitle}, { status: 200 });
}
